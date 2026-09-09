#!/usr/bin/env node
/**
 * createCombinedSources.js
 * -----------------------------------------------------------------------
 * Reads aurora_us.tsv and aurora_eu.tsv, maps every row from each file
 * onto the shared "combined_source_data" schema defined in bcrf-data-mapped.js
 * (the `common_fields` crosswalk), and loads the result into a DuckDB
 * table called `combined_source_data` (one output row per input row).
 *
 * Usage:
 *   node createCombinedSources.js \
 *     --us ./aurora_us.tsv \
 *     --eu ./aurora_eu.tsv \
 *     --db ./duckdb.db
 *
 * -----------------------------------------------------------------------
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { DuckDBInstance } = require('@duckdb/node-api');

// --------------------------------------------------------------------------
// 0. CLI args
// --------------------------------------------------------------------------

const tableName = 'combined_source_data';

function parseArgs(argv) {
  const args = {
    us: 'aurora_us.tsv',
    eu: 'aurora_eu.tsv',
    db: 'duckdb.db',
  };
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === '--us') args.us = argv[++i];
    else if (a === '--eu') args.eu = argv[++i];
    else if (a === '--db') args.db = argv[++i];
  }
  return args;
}

const ARGS = parseArgs(process.argv.slice(2));

// --------------------------------------------------------------------------
// 1. Tiny TSV parser
//    (Both files are plain tab-separated with no quoting/escaping, so a
//    straightforward split is sufficient and avoids an extra dependency.)
// --------------------------------------------------------------------------

function parseTSV(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');
  const lines = raw.split('\n').filter((l) => l.length > 0);
  const headers = lines[0].split('\t');
  const rows = [];
  for (let i = 1; i < lines.length; i += 1) {
    const cells = lines[i].split('\t');
    const row = {};
    headers.forEach((h, idx) => {
      row[h] = cells[idx] !== undefined ? cells[idx] : '';
    });
    rows.push(row);
  }
  return rows;
}

// --------------------------------------------------------------------------
// 2. Small value-map helpers
// --------------------------------------------------------------------------

// Look a raw value up in a map; fall back to a default (usually 'Unknown')
// if the value isn't present in the map at all.
function mapValue(map, rawValue, fallback = 'Unknown') {
  if (rawValue === undefined || rawValue === null) return fallback;
  return Object.prototype.hasOwnProperty.call(map, rawValue)
    ? map[rawValue]
    : fallback;
}

const US_NA = new Set(['NA', 'N/A', '', undefined, null]);
const EU_NA = new Set(['N/A', 'NA', '', undefined, null]);

// --------------------------------------------------------------------------
// 3. Per-source mapping functions
//
//    These implement the `aurora-combined` common_fields crosswalk from
//    bcrf-data-mapped.js. Each function takes one raw source row and
//    returns the row's value for a single canonical field. Simple 1:1
//    value substitutions use mapValue(); fields that require combining
//    several source columns (e.g. deriving Molecular Subtype from ER/PR/
//    HER2) are written out explicitly, following the notes in the spec.
// --------------------------------------------------------------------------

// ---- aurora-us -> canonical -------------------------------------------------

function usMolecularSubtypeIHC(row) {
  const er = row['Estrogen Receptor Status'];
  const pr = row['Progesterone Receptor Status'];
  const her2 = row['Primary tumor HER2 status interpretation'];
  if ([er, pr, her2].includes('Unknown')) return 'Unknown';
  if (her2 === 'Positive') return 'HER2+';
  if (her2 === 'Negative' && (er === 'Positive' || pr === 'Positive'))
    return 'HR+/HER2-';
  if (her2 === 'Negative' && er === 'Negative' && pr === 'Negative')
    return 'TNBC';
  return 'Unknown';
}

function usHER2Status(row) {
  return mapValue(
    { Positive: 'Positive', Negative: 'Negative', Unknown: 'Unknown' },
    row['Primary tumor HER2 status interpretation'],
    'Unknown',
  );
}

function usHRStatus(row) {
  const er = row['Estrogen Receptor Status'];
  const pr = row['Progesterone Receptor Status'];
  if (er === 'Positive' || pr === 'Positive') return 'Positive';
  if (er === 'Negative' && pr === 'Negative') return 'Negative';
  return 'Unknown'; // either ER or PR is Unknown
}

function usDeNovoMetastatic(row) {
  const map = {
    'Not applicable (Stage IV at presentation)': 'Yes',
    Yes: 'No',
    No: 'No',
    NA: 'Unknown',
  };
  return mapValue(
    map,
    row['Did the patient receive adjuvant treatment for localized disease?'],
    'Unknown',
  );
}

function usAdjuvantTreatment(row) {
  const map = {
    Yes: 'Yes',
    No: 'No',
    'Not applicable (Stage IV at presentation)':
      'Not Applicable (De Novo Metastatic)',
    NA: 'Unknown',
  };
  return mapValue(
    map,
    row['Did the patient receive adjuvant treatment for localized disease?'],
    'Unknown',
  );
}

function usNeoadjuvantTreatment(_row) {
  // US has no equivalent field at all.
  return 'Unknown';
}

function usSampleType(row) {
  return mapValue(
    { Primary: 'Primary', Metastatic: 'Metastatic' },
    row['Sample_Type'],
    'Unknown',
  );
}

function usMetastaticBiopsySite(_row) {
  // US records Metastatic vs Primary but never the anatomic site.
  return 'Unknown';
}

function usPathologicNStage(row) {
  const map = {
    pN0: 'N0',
    pN1: 'N1',
    pN2: 'N2',
    pN3: 'N3',
    pNx: 'NX',
    NA: 'Unknown',
    Unknown: 'Unknown',
  };
  return mapValue(map, row['Pathologic N'], 'Unknown');
}

function usPrimaryTumorSizeCategory(row) {
  const map = {
    pT1: 'T1/T2 (Smaller)',
    pT2: 'T1/T2 (Smaller)',
    pT3: 'T3/T4 (Larger)',
    pT4: 'T3/T4 (Larger)',
    NA: 'Unknown',
    Unknown: 'Unknown',
  };
  return mapValue(map, row['Pathologic T'], 'Unknown');
}

function usHistologicGrade(_row) {
  // US does not report tumor grade anywhere in its metadata.
  return 'Unknown';
}

function usPAM50Subtype(_row) {
  // EU-only facet (gene-expression derived); US has no equivalent.
  return 'Unknown';
}

function usSex(row) {
  return mapValue({ Female: 'Female' }, row['Sex'], 'Unknown');
}

function mapUsRow(row) {
  return {
    Source: 'aurora-us',
    'Source Record ID': row['Sample ID'],
    'Patient ID': row['Patient ID'],
    'Molecular Subtype (Clinical IHC)': usMolecularSubtypeIHC(row),
    'HER2 Status': usHER2Status(row),
    'Hormone Receptor (HR) Status': usHRStatus(row),
    'De Novo Metastatic Disease': usDeNovoMetastatic(row),
    'Adjuvant Treatment for Localized Disease': usAdjuvantTreatment(row),
    'Neoadjuvant Treatment for Localized Disease': usNeoadjuvantTreatment(row),
    'Sample Type': usSampleType(row),
    'Metastatic Biopsy Site (Anatomic)': usMetastaticBiopsySite(row),
    'Pathologic N Stage': usPathologicNStage(row),
    'Primary Tumor Size Category': usPrimaryTumorSizeCategory(row),
    'Histologic Grade': usHistologicGrade(row),
    'Intrinsic Molecular Subtype (PAM50)': usPAM50Subtype(row),
    Sex: usSex(row),
  };
}

// ---- aurora-eu -> canonical -------------------------------------------------

// EU rows are one-per-patient rather than one-per-sample. Several EU fields
// (PAM50_primary/PAM50_meta, IHC_primary/IHC_meta) are pre-split by whether
// they describe the primary tumor or the metastatic sample, and EU has no
// single "sample type" column — the spec derives it from whether
// metastatic_biopsy_site is populated.
function euDerivedSampleType(row) {
  const site = row['metastatic_biopsy_site'];
  return EU_NA.has(site) ? 'Primary' : 'Metastatic';
}

function euMolecularSubtypeIHC(row) {
  return mapValue(
    { 'HER2+': 'HER2+', 'HR+/HER2-': 'HR+/HER2-', TNBC: 'TNBC' },
    row['type'],
    'Unknown',
  );
}

function euHER2Status(row) {
  const map = {
    'HER2+': 'Positive',
    'HR+/HER2-': 'Negative',
    TNBC: 'Negative',
  };
  return mapValue(map, row['type'], 'Unknown');
}

function euHRStatus(row) {
  const map = {
    'HR+/HER2-': 'Positive',
    TNBC: 'Negative',
    'HER2+': 'Indeterminate (HER2+)',
  };
  return mapValue(map, row['type'], 'Unknown');
}

function euDeNovoMetastatic(row) {
  const v = row['is_de_novo'];
  if (v === 'TRUE' || v === 'true') return 'Yes';
  if (v === 'FALSE' || v === 'false') return 'No';
  return 'Unknown';
}

function euAdjuvantTreatment(row) {
  const adjuvant = row['adjuvant'];
  const isDeNovo = row['is_de_novo'];
  const truthy = (v) => v === 'TRUE' || v === 'true';
  if (truthy(adjuvant)) return 'Yes';
  if (!truthy(adjuvant) && truthy(isDeNovo))
    return 'Not Applicable (De Novo Metastatic)';
  if (!truthy(adjuvant) && !truthy(isDeNovo)) return 'No';
  return 'Unknown';
}

function euNeoadjuvantTreatment(row) {
  const v = row['neoadjuvant'];
  if (v === 'TRUE' || v === 'true') return 'Yes';
  if (v === 'FALSE' || v === 'false') return 'No';
  return 'Unknown';
}

function euSampleType(row) {
  return euDerivedSampleType(row);
}

function euMetastaticBiopsySite(row) {
  const site = row['metastatic_biopsy_site'];
  return EU_NA.has(site) ? 'Unknown' : site; // pass-through for real site names
}

function euPathologicNStage(row) {
  const map = { N0: 'N0', N1: 'N1', N2: 'N2', N3: 'N3', NX: 'NX' };
  return mapValue(map, row['primary_patho_node_status'], 'Unknown');
}

function euPrimaryTumorSizeCategory(row) {
  const map = { TRUE: 'T1/T2 (Smaller)', FALSE: 'T3/T4 (Larger)' };
  return mapValue(map, row['primary_size_t1_or_t2'], 'Unknown');
}

function euHistologicGrade(row) {
  const map = { 1: '1', 2: '2', 3: '3', 4: '4' };
  return mapValue(map, row['primary_grade'], 'Unknown');
}

function euPAM50Subtype(row) {
  const sampleType = euDerivedSampleType(row);
  const raw =
    sampleType === 'Metastatic' ? row['PAM50_meta'] : row['PAM50_primary'];
  const map = {
    Basal: 'Basal',
    Her2: 'Her2',
    LumA: 'LumA',
    LumB: 'LumB',
    Normal: 'Normal',
  };
  return mapValue(map, raw, 'Unknown');
}

function euSex(_row) {
  // No sex field in EU; assumed Female per the crosswalk notes (unverified).
  return 'Female (assumed, unverified)';
}

function mapEuRow(row) {
  return {
    Source: 'aurora-eu',
    'Source Record ID': row['ssid'],
    'Patient ID': row['ssid'],
    'Molecular Subtype (Clinical IHC)': euMolecularSubtypeIHC(row),
    'HER2 Status': euHER2Status(row),
    'Hormone Receptor (HR) Status': euHRStatus(row),
    'De Novo Metastatic Disease': euDeNovoMetastatic(row),
    'Adjuvant Treatment for Localized Disease': euAdjuvantTreatment(row),
    'Neoadjuvant Treatment for Localized Disease': euNeoadjuvantTreatment(row),
    'Sample Type': euSampleType(row),
    'Metastatic Biopsy Site (Anatomic)': euMetastaticBiopsySite(row),
    'Pathologic N Stage': euPathologicNStage(row),
    'Primary Tumor Size Category': euPrimaryTumorSizeCategory(row),
    'Histologic Grade': euHistologicGrade(row),
    'Intrinsic Molecular Subtype (PAM50)': euPAM50Subtype(row),
    Sex: euSex(row),
  };
}

// --------------------------------------------------------------------------
// 4. DuckDB setup + load
// --------------------------------------------------------------------------

// Canonical column names, matching the `name` field of each entry in the
// aurora-combined `common_fields` crosswalk (bcrf-data-mapped.js) verbatim,
// so the DuckDB schema reads the same as the source-of-truth mapping doc.
const CANONICAL_COLUMNS = [
  'Source',
  'Source Record ID',
  'Patient ID',
  'Molecular Subtype (Clinical IHC)',
  'HER2 Status',
  'Hormone Receptor (HR) Status',
  'De Novo Metastatic Disease',
  'Adjuvant Treatment for Localized Disease',
  'Neoadjuvant Treatment for Localized Disease',
  'Sample Type',
  'Metastatic Biopsy Site (Anatomic)',
  'Pathologic N Stage',
  'Primary Tumor Size Category',
  'Histologic Grade',
  'Intrinsic Molecular Subtype (PAM50)',
  'Sex',
];

// DuckDB identifiers with spaces/punctuation must be double-quoted; this
// helper also escapes any literal double-quotes in a column name.
function quoteIdent(name) {
  return `"${name.replace(/"/g, '""')}"`;
}

async function main() {
  const usPath = path.resolve(ARGS.us);
  const euPath = path.resolve(ARGS.eu);
  const dbPath = path.resolve(ARGS.db);

  console.log(`Reading US file: ${usPath}`);
  const usRows = parseTSV(usPath).map(mapUsRow);
  console.log(`  -> ${usRows.length} rows mapped`);

  console.log(`Reading EU file: ${euPath}`);
  const euRows = parseTSV(euPath).map(mapEuRow);
  console.log(`  -> ${euRows.length} rows mapped`);

  const combined = [...usRows, ...euRows];

  console.log(`Opening DuckDB database: ${dbPath}`);
  const instance = await DuckDBInstance.create(dbPath);
  const connection = await instance.connect();

  await connection.run(`
    CREATE OR REPLACE TABLE ${tableName} (
      ${CANONICAL_COLUMNS.map((c) => `${quoteIdent(c)} VARCHAR`).join(',\n      ')}
    );
  `);

  // The appender API is the fastest way to bulk-load rows in @duckdb/node-api.
  const appender = await connection.createAppender(tableName);
  for (const rec of combined) {
    for (const col of CANONICAL_COLUMNS) {
      const val = rec[col];
      if (val === undefined || val === null) {
        appender.appendNull();
      } else {
        appender.appendVarchar(String(val));
      }
    }
    appender.endRow();
  }
  appender.closeSync(); // flushes remaining buffered rows

  const countReader = await connection.runAndReadAll(
    `SELECT COUNT(*) AS cnt FROM ${tableName}`,
  );
  const cnt = countReader.getRows()[0][0];
  console.log(
    `Loaded ${cnt} rows into ${tableName} (${usRows.length} US + ${euRows.length} EU).`,
  );

  const bySourceReader = await connection.runAndReadAll(
    `SELECT ${quoteIdent('Source')}, COUNT(*) AS n FROM ${tableName} GROUP BY ${quoteIdent('Source')} ORDER BY ${quoteIdent('Source')}`,
  );
  console.table(bySourceReader.getRowObjects());

  connection.closeSync();
  console.log(`Done. Database written to ${dbPath}`);
}

main().catch((err) => {
  console.error(`Failed to build ${tableName} table: `, err);
  process.exit(1);
});
