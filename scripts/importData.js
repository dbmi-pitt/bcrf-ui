import duckdb from '@duckdb/node-api';
import fs from 'fs';
import path from 'path';

// Usage: node load-tsvs.js [directory] [db-path]
const DATA_DIR = process.argv[2] || './data';
const DB_PATH = process.argv[3] || 'duckdb.db';

/**
 * Converts a filename like "brca_aurora_us_2023.tsv" into a safe SQL table name.
 * - Strips the .tsv extension
 * - Replaces any character that isn't alphanumeric/underscore with an underscore
 * - Prefixes with an underscore if the name starts with a digit (invalid SQL identifier)
 */
function toTableName(filename) {
  const base = path.basename(filename, '.tsv');
  let name = base.replace(/[^a-zA-Z0-9_]/g, '_');
  if (/^[0-9]/.test(name)) {
    name = `_${name}`;
  }
  return name;
}

async function main() {
  if (!fs.existsSync(DATA_DIR)) {
    console.error(`Directory not found: ${DATA_DIR}`);
    process.exit(1);
  }

  const files = fs
    .readdirSync(DATA_DIR)
    .filter((f) => f.toLowerCase().endsWith('.tsv'));

  if (files.length === 0) {
    console.log(`No .tsv files found in ${DATA_DIR}`);
    return;
  }

  const instance = await duckdb.DuckDBInstance.create(DB_PATH);
  const connection = await instance.connect();

  for (const file of files) {
    const filePath = path.join(DATA_DIR, file);
    const tableName = toTableName(file);

    console.log(`Loading ${filePath} -> table "${tableName}"`);

    try {
      const escapedPath = filePath.replace(/'/g, "''");

      await connection.run(`
        CREATE OR REPLACE TABLE "${tableName}" AS
        SELECT * FROM read_csv('${escapedPath}', delim='\t', header=true, nullstr=['NA', 'na', 'N/A', 'n/a', 'NULL', 'null', ''])
      `);

      const countResult = await connection.run(
        `SELECT COUNT(*) AS count FROM "${tableName}"`,
      );
      const [{ count }] = await countResult.getRowObjects();
      console.log(`  -> loaded ${count} rows`);
    } catch (err) {
      console.error(`  Failed to load ${file}:`, err.message);
    }
  }

  console.log(`\nDone. Database: ${DB_PATH}`);
}

main();
