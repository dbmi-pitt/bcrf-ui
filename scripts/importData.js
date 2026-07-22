import duckdb from '@duckdb/node-api';
import fs from 'fs';
import path from 'path';

// Usage: node load-tsvs.js [directory] [db-path]
const DATA_DIR = process.argv[2] || './data';
const DB_PATH = process.argv[3] || 'duckdb.db';

const instance = await duckdb.DuckDBInstance.create(DB_PATH);
const connection = await instance.connect();

const dataDir = path.resolve(DATA_DIR);

// aurora us
await connection.run(`
    CREATE TABLE aurora_us AS
    SELECT
        * REPLACE (
            TRY_CAST(TRIM("Age at Diagnosis") AS DOUBLE)                 AS "Age at Diagnosis",
            TRY_CAST(TRIM("Fraction Genome Altered") AS DOUBLE)          AS "Fraction Genome Altered",
            TRY_CAST(TRIM("Mutation Count") AS INTEGER)                  AS "Mutation Count",
            TRY_CAST(TRIM("Percent Lymphocyte Infiltration") AS INTEGER) AS "Percent Lymphocyte Infiltration",
            TRY_CAST(TRIM("Percent Necrosis") AS INTEGER)                AS "Percent Necrosis",
            TRY_CAST(TRIM("Percent Normal Cells") AS INTEGER)            AS "Percent Normal Cells",
            TRY_CAST(TRIM("Percent Stromal Cells") AS INTEGER)           AS "Percent Stromal Cells",
            TRY_CAST(TRIM("Percent Tumor Cells") AS INTEGER)             AS "Percent Tumor Cells",
            TRY_CAST(TRIM("Percent Tumor Nuclei") AS INTEGER)            AS "Percent Tumor Nuclei"
        )
    FROM read_csv('${path.join(dataDir, 'aurora_us.tsv')}', delim='\t', header=true, all_varchar=true);
`);

// aurora eu
await connection.run(`
    CREATE TABLE aurora_eu AS
    SELECT
        * REPLACE (
            TRY_CAST(TRIM("overall_survival_days") AS INTEGER)           AS "overall_survival_days",
            TRY_CAST(TRIM("time_to_metastatic_relapse_days") AS INTEGER) AS "time_to_metastatic_relapse_days"
        )
    FROM read_csv('${path.join(dataDir, 'aurora_eu.tsv')}', delim='\t', header=true, all_varchar=true);
`);
