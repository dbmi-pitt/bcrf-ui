#!/usr/bin/env node
/**
 * Extract unique values for every column of a DuckDB table into a JSON file.
 *
 * Usage:
 *   node extractUniqueCombinedValues.js [dbPath] [tableName] [outputPath]
 *
 * Defaults:
 *   dbPath      -> ./duckdb.db
 *   tableName   -> combined_source_data
 *   outputPath  -> ./uniqueCombinedValues.json
 *
 * Requires the "@duckdb/node-api" npm package:
 *   npm install @duckdb/node-api
 */

const fs = require('fs');
const { DuckDBInstance } = require('@duckdb/node-api');

const dbPath = process.argv[2] || './duckdb.db';
const tableName = process.argv[3] || 'combined_source_data';
const outputPath = process.argv[4] || './uniqueCombinedValues.json';

const IGNORED_COLUMNS = new Set(['Source Record ID', 'Source', 'Patient ID']);

async function all(connection, sql) {
    const reader = await connection.runAndReadAll(sql);
    return reader.getRowObjects();
}

async function main() {
    const instance = await DuckDBInstance.create(dbPath);
    const connection = await instance.connect();

    // Get column names for the table
    const columnsInfo = await all(connection, `DESCRIBE ${tableName}`);
    const columnNames = columnsInfo
        .map((row) => row.column_name)
        .filter((col) => !IGNORED_COLUMNS.has(col));

    const result = {};

    for (const col of columnNames) {
        console.log(`Processing column: ${col}`);

        // Quote the column name to be safe with special characters/reserved words
        const rows = await all(
            connection,
            `SELECT DISTINCT "${col}" AS val FROM ${tableName} WHERE "${col}" IS NOT NULL ORDER BY "${col}"`
        );

        const values = rows.map((row) => {
            const v = row.val;
            // Normalize everything to a plain value that JSON can represent
            if (v === null || v === undefined) return null;
            if (typeof v === 'bigint') return v.toString();
            if (v instanceof Date) return v.toISOString();
            // DuckDB Neo client returns some types (DECIMAL, etc.) as
            // objects with a toString(); fall back to that for anything
            // that isn't already a plain string/number/boolean.
            if (typeof v === 'object' && typeof v.toString === 'function') {
                return v.toString();
            }
            return v;
        });

        result[col] = values;
        console.log(`  -> ${values.length} unique value(s)`);
    }

    fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), 'utf-8');
    console.log(`\nDone. Wrote unique values to ${outputPath}`);

    connection.closeSync();
}

main().catch((err) => {
    console.error('Error:', err);
    process.exit(1);
});
