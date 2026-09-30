#!/usr/bin/env node
/**
 * exportSourceTags.js
 *
 * For every source in charts.js, loads its chart config file, finds every
 * chart whose filter type is "term", queries the given DuckDB database for
 * the DISTINCT values of that chart's column, and writes everything out to
 * a single JSON file shaped like:
 *
 * [
 *   {
 *     "id": "aurora-us",
 *     "charts": [
 *       { "title": "Cancer Type Detailed", "values": ["...", "..."] }
 *     ]
 *   }
 * ]
 *
 * Usage:
 *   node exportSourceTags.js <path-to-duckdb-file> [output.json]
 */

const fs = require('fs');
const path = require('path');
const Module = require('module');
const duckdb = require('@duckdb/node-api');

const { DuckDBInstance } = duckdb;

const fileDirectory = path.join(__dirname, '../src/lib/sources/config');
const chartsMapPath = path.join(__dirname, '../src/lib/sources/charts.js');

// Parses charts.js as text to get each id and config filename, since it
// can't be imported directly (uses 'server-only' and the '@/' alias).
function discoverSources() {
  const code = fs.readFileSync(chartsMapPath, 'utf8');
  const pattern =
    /['"]([\w-]+)['"]\s*:\s*\(await import\(['"][^'"]*\/config\/([^'"]+)['"]\)\)\.CONFIG/g;

  const sources = [];
  let match;
  while ((match = pattern.exec(code)) !== null) {
    const [, id, fileName] = match;
    sources.push({ id, fileName });
  }

  if (sources.length === 0) {
    throw new Error(`No source entries found in ${chartsMapPath}`);
  }

  return sources;
}

// Strips the "export" keyword from config files and compiles them as CJS.
function loadConfigModule(filePath) {
  const code = fs.readFileSync(filePath, 'utf8');
  const exportNames = [];

  const transformed =
    code.replace(/export\s+const\s+(\w+)/g, (_match, name) => {
      exportNames.push(name);
      return `const ${name}`;
    }) + `\nmodule.exports = { ${exportNames.join(', ')} };\n`;

  const mod = new Module(filePath, module);
  mod.filename = filePath;
  mod.paths = Module._nodeModulePaths(path.dirname(filePath));
  mod._compile(transformed, filePath);

  return mod.exports;
}

async function getUniqueValues(connection, tableName, column) {
  const query = `
    SELECT DISTINCT "${column}" AS val
    FROM ${tableName}
    WHERE "${column}" IS NOT NULL
    ORDER BY val;
  `;

  const reader = await connection.runAndReadAll(query);
  const rows = reader.getRowObjects();
  return rows.map((row) => row.val);
}

async function main() {
  const dbPath = process.argv[2];
  const outputPath =
    process.argv[3] || path.join(process.cwd(), 'uniqueValues.json');

  if (!dbPath) {
    console.error(
      'Usage: node exportSourceTags.js <duckdb-file-path> [output.json]',
    );
    process.exit(1);
  }

  if (!fs.existsSync(dbPath)) {
    console.error(`DuckDB file not found: ${dbPath}`);
    process.exit(1);
  }

  const instance = await DuckDBInstance.create(dbPath);
  const connection = await instance.connect();

  const sources = discoverSources();
  console.log(`Discovered ${sources.length} source(s) from ${chartsMapPath}`);

  const output = [];

  for (const source of sources) {
    console.log(`\nProcessing source: ${source.id}`);

    const configPath = path.join(fileDirectory, source.fileName);
    let CONFIG;
    try {
      ({ CONFIG } = loadConfigModule(configPath));
    } catch (err) {
      console.error(`  Failed to load config (${configPath}): ${err.message}`);
      continue;
    }

    const termCharts = (CONFIG.charts || []).filter(
      (chart) => chart.filter && chart.filter.type === 'term',
    );

    const tableName = CONFIG.table;
    if (!tableName) {
      console.error(`  Skipping ${source.id}: config has no "table" field`);
      continue;
    }

    const chartsOutput = [];

    for (const chart of termCharts) {
      const column = chart.filter.column;

      try {
        const values = await getUniqueValues(connection, tableName, column);
        chartsOutput.push({ title: chart.title, values });
        console.log(
          `  "${chart.title}" (${column}): ${values.length} unique values`,
        );
      } catch (err) {
        console.error(
          `  Failed on "${chart.title}" (column: ${column}, table: ${tableName}): ${err.message}`,
        );
      }
    }

    output.push({ id: source.id, charts: chartsOutput });
  }

  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
  console.log(`\nWrote output to ${outputPath}`);

  if (typeof connection.closeSync === 'function') connection.closeSync();
  if (typeof instance.closeSync === 'function') instance.closeSync();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
