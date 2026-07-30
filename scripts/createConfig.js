#!/usr/bin/env node
/**
 * tsv-to-config.js
 *
 * Reads a TSV file and generates a JavaScript config file in the shape:
 *
 *   export const CONFIG = {
 *     id: 'file-name',
 *     table: 'file_name',
 *     charts: [ ... ]
 *   }
 *
 * For each column in the TSV, this script decides whether the column is
 * "mostly numeric" (-> histogram chart) or not (-> pie chart), and builds
 * a DuckDB query for that chart following the templates in notes.md.
 *
 * Usage:
 *   node tsv-to-config.js <input.tsv> [output.js]
 *
 * If [output.js] is omitted, the output is written next to the input file
 * using the same base name, e.g. "my-data.tsv" -> "my-data.config.js".
 */

const fs = require('fs');
const path = require('path');

// ---------- helpers ----------

function toKebabCase(str) {
  return String(str)
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[_\s]+/g, '-')
    .replace(/[^a-zA-Z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
}

function toSnakeCase(str) {
  return String(str)
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/[-\s]+/g, '_')
    .replace(/[^a-zA-Z0-9_]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '')
    .toLowerCase();
}

function toTitleCase(str) {
  return String(str)
    .replace(/[_-]+/g, ' ')
    .trim()
    .split(/\s+/)
    .map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1) : w))
    .join(' ');
}

// Basic TSV parser: no quoting rules assumed (plain tab-delimited).
function parseTSV(content) {
  // Handle both \n and \r\n line endings, and strip trailing blank lines.
  const lines = content.split(/\r?\n/).filter((line) => line.length > 0);
  if (lines.length === 0) {
    throw new Error('TSV file appears to be empty.');
  }
  const headers = lines[0].split('\t').map((h) => h.trim());
  const rows = lines.slice(1).map((line) => line.split('\t'));
  return { headers, rows };
}

// A value counts as numeric if, after trimming and stripping thousands
// separators, it matches an int or float pattern (optionally signed).
const NUMERIC_RE = /^-?\d+(\.\d+)?$/;

function isNumericValue(raw) {
  if (raw === undefined || raw === null) return false;
  const v = raw.trim().replace(/,/g, '');
  if (v === '') return false;
  return NUMERIC_RE.test(v);
}

// A column is "mostly numeric" if >80% of its non-empty values are numeric.
function isMostlyNumericColumn(values) {
  const nonEmpty = values.map((v) => (v ?? '').trim()).filter((v) => v !== '');
  if (nonEmpty.length === 0) return false;
  const numericCount = nonEmpty.filter(isNumericValue).length;
  return numericCount / nonEmpty.length > 0.8;
}

// ---------- chart builders ----------

function buildPieChart(columnName, tableName) {
  const chartId = toKebabCase(columnName);
  const title = toTitleCase(columnName);
  return {
    id: chartId,
    title: `${title}`,
    types: ['pie', 'table'],
    filter: {
      column: columnName,
      type: 'term',
    },
    labels: {
      x: title,
      y: 'Count',
      freq: 'Frequency',
    },
    // query is generated separately as source code (see toChartSource)
    __queryColumn: columnName,
    __table: tableName,
    __kind: 'pie',
  };
}

function buildHistogramChart(columnName, tableName) {
  const chartId = toKebabCase(columnName);
  const title = toTitleCase(columnName);
  return {
    id: chartId,
    title: `${title}`,
    types: ['histogram'],
    filter: {
      column: columnName,
      type: 'range',
    },
    labels: {
      x: title,
      y: 'Count',
    },
    __queryColumn: columnName,
    __table: tableName,
    __kind: 'histogram',
  };
}

// Render a single chart object (including its query function) as JS source.
function chartToSource(chart) {
  const { id, title, types, filter, labels, __queryColumn, __table, __kind } =
    chart;

  let querySource;
  if (__kind === 'pie') {
    querySource = `(clause) => {
                const whereClause = clause ? \`WHERE \${clause}\` : '';
                // Cast y to integer to avoid returning a string value for count
                return \`
                SELECT
                  "${__queryColumn}" AS x,
                  CAST(COUNT(*) AS INTEGER) AS y,
                  ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 2) AS freq
                FROM ${__table}
                \${whereClause}
                GROUP BY x
                ORDER BY y DESC;
                \`;
            }`;
  } else {
    querySource = `(clause) => {
                const whereClause = clause ? \`AND \${clause}\` : '';
                return \`
                SELECT "${__queryColumn}" AS x
                FROM ${__table}
                WHERE x IS NOT NULL
                \${whereClause};
                \`;
            }`;
  }

  return `        {
            id: '${id}',
            title: '${title.replace(/'/g, "\\'")}',
            types: [${types.map((t) => `'${t}'`).join(', ')}],
            filter: {
                column: '${filter.column}',
                type: '${filter.type}'
            },
            labels: {
                x: '${labels.x.replace(/'/g, "\\'")}',
                y: '${labels.y.replace(/'/g, "\\'")}',
                freq: '${labels.freq.replace(/'/g, "\\'")}',
            },
            query: ${querySource},
        }`;
}

// ---------- main ----------

function main() {
  const [, , inputArg, outputArg] = process.argv;

  if (!inputArg) {
    console.error('Usage: node tsv-to-config.js <input.tsv> [output.js]');
    process.exit(1);
  }

  const inputPath = path.resolve(inputArg);
  if (!fs.existsSync(inputPath)) {
    console.error(`Input file not found: ${inputPath}`);
    process.exit(1);
  }

  const baseName = path.basename(inputPath, path.extname(inputPath));
  const fileId = toKebabCase(baseName);
  const tableName = toSnakeCase(baseName);

  const outputPath = outputArg
    ? path.resolve(outputArg)
    : path.join(path.dirname(inputPath), `${baseName}.config.js`);

  const content = fs.readFileSync(inputPath, 'utf8');
  const { headers, rows } = parseTSV(content);

  const charts = headers.map((header, colIndex) => {
    const columnValues = rows.map((row) => row[colIndex]);
    const mostlyNumeric = isMostlyNumericColumn(columnValues);
    return mostlyNumeric
      ? buildHistogramChart(header, tableName)
      : buildPieChart(header, tableName);
  });

  const chartsSource = charts.map(chartToSource).join(',\n');

  const fileSource = `export const CONFIG = {
    id: '${fileId}',
    table: '${tableName}',
    charts: [
      ${chartsSource}
    ]
  }
`;

  fs.writeFileSync(outputPath, fileSource, 'utf8');

  console.log(
    `Read ${headers.length} column(s) and ${rows.length} row(s) from ${inputPath}`,
  );
  headers.forEach((header, i) => {
    const mostlyNumeric = isMostlyNumericColumn(rows.map((row) => row[i]));
    console.log(`  - ${header}: ${mostlyNumeric ? 'histogram' : 'pie'}`);
  });
  console.log(`Config written to ${outputPath}`);
}

main();
