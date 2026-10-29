#!/usr/bin/env node
/**
 * Insert the rows of a Combined Sources TSV file into an existing DuckDB table.
 *
 * Usage:
 *   node insertTsvIntoTable.js [dbPath] [tableName] [tsvPath]
 *
 * Defaults:
 *   dbPath      -> ./duckdb.db
 *   tableName   -> combined_source_data
 *   tsvPath     -> ./combined_source_data_output.tsv
 *
 * Requires the "@duckdb/node-api" npm package:
 *   npm install @duckdb/node-api
 */

const fs = require('fs');
const { DuckDBInstance } = require('@duckdb/node-api');

const dbPath = process.argv[2] || './duckdb.db';
const tableName = process.argv[3] || 'combined_source_data';
const tsvPath = process.argv[4] || 'combined_source_data_output.tsv';

async function all(connection, sql) {
  const reader = await connection.runAndReadAll(sql);
  return reader.getRowObjects();
}

async function countRows(connection) {
  const rows = await all(connection, `SELECT count(*) AS n FROM ${tableName}`);
  return Number(rows[0].n);
}

async function main() {
  if (!fs.existsSync(tsvPath)) {
    throw new Error(`TSV file not found: ${tsvPath}`);
  }

  const instance = await DuckDBInstance.create(dbPath);
  const connection = await instance.connect();

  try {
    const before = await countRows(connection);
    console.log(`Rows in ${tableName} before insert: ${before}`);

    // Escape single quotes so the path is safe inside a SQL string literal
    const safePath = tsvPath.replace(/'/g, "''");

    console.log(`Inserting ${tsvPath} into ${tableName}...`);
    // SELECT * maps columns by position. Use "INSERT INTO ... BY NAME"
    // instead if the TSV column order differs from the table's.
    await connection.run(
      `INSERT INTO ${tableName} SELECT * FROM read_csv('${safePath}', delim='\\t', header=true)`,
    );

    const after = await countRows(connection);
    console.log(`Rows in ${tableName} after insert:  ${after}`);
    console.log(`\nDone. Inserted ${after - before} row(s).`);
  } finally {
    connection.closeSync();
    instance.closeSync();
  }
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
