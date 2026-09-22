export const CONFIG = {
  id: 'aurora-us',
  table: 'aurora_us',
  keyColumn: 'Sample ID',
  charts: [
    {
      id: 'cancer-type-detailed',
      title: 'Cancer Type Detailed',
      types: ['pie', 'table'],
      filter: {
        column: 'Cancer Type Detailed',
        type: 'term',
      },
      labels: {
        x: 'Cancer Type Detailed',
        y: 'Count',
        freq: 'Frequency',
      },
      tooltip: 'Cancer Type Detailed Tooltip Text',
      query: (clause) => {
        const whereClause = clause ? `WHERE ${clause}` : '';
        // Cast y to integer to avoid returning a string value for count
        return `
          SELECT 
            "Cancer Type Detailed" AS x,
            CAST(COUNT(*) AS INTEGER) AS y,
            ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 2) AS freq
          FROM aurora_us
          ${whereClause}
          GROUP BY x
          ORDER BY y DESC;
        `;
      },
    },
    {
      id: 'mutation-count',
      title: 'Mutation Count',
      types: ['histogram'],
      filter: {
        column: 'Mutation Count',
        type: 'range',
      },
      labels: {
        x: 'Mutation',
        y: 'Count',
        studyId: 'Study ID',
        patientId: 'Patient ID',
      },
      bins: [
        { value: 0, label: '<=50' },
        { value: 50, label: '50' },
        { value: 100, label: '100' },
        { value: 150, label: '150' },
        { value: 200, label: '200' },
        { value: 250, label: '250' },
        { value: 300, label: '300' },
        { value: 350, label: '350' },
        { value: 400, label: '400' },
        { value: 450, label: '450' },
        { value: 500, label: '500' },
        { value: 550, label: '550' },
        { value: 600, label: '600' },
        { value: 650, label: '650' },
        { value: 700, label: '700' },
        { value: 750, label: '750' },
        { value: 800, label: '>800' },
      ],
      query: (clause) => {
        const whereClause = clause ? `AND ${clause}` : '';
        return `
          SELECT "Study ID" AS "studyId", "Patient ID" AS "patientId", "Mutation Count" AS x
          FROM aurora_us
          WHERE x IS NOT NULL
          ${whereClause};
        `;
      },
    },
    {
      id: 'number-of-samples-per-patient',
      title: 'Number of Samples Per Patient',
      types: ['pie', 'table'],
      filter: {
        column: 'Number of Samples Per Patient',
        type: 'term',
      },
      labels: {
        x: 'Number of Samples',
        y: 'Count',
        freq: 'Frequency',
      },
      query: (clause) => {
        const whereClause = clause ? `WHERE ${clause}` : '';
        return `
          SELECT 
            "Number of Samples Per Patient" AS x,
            CAST(COUNT(DISTINCT "Patient ID") AS INTEGER) AS y,
            ROUND(100.0 * COUNT(DISTINCT "Patient ID") / SUM(COUNT(DISTINCT "Patient ID")) OVER (), 2) AS freq
          FROM aurora_us
          ${whereClause}
          GROUP BY x
          ORDER BY y DESC
        `;
      },
    },
    {
      id: 'clinical-stage',
      title: 'Clinical Stage',
      types: ['pie', 'table'],
      filter: {
        column: 'Clinical Stage',
        type: 'term',
      },
      labels: {
        x: 'Clinical Stage',
        y: 'Count',
        freq: 'Frequency',
      },
      data: [
        { x: 'Stage IIA', y: 12, freq: 21.82 },
        { x: 'Stage IIB', y: 12, freq: 21.82 },
        { x: 'Stage I', y: 10, freq: 18.18 },
        { x: 'Unknown', y: 8, freq: 14.55 },
        { x: 'Stage IV', y: 6, freq: 10.91 },
        { x: 'Stage IIIB', y: 5, freq: 9.09 },
        { x: 'Stage IIIA', y: 2, freq: 3.64 },
      ],
      query: (clause) => {
        const whereClause = clause ? `WHERE ${clause}` : '';
        return `
          SELECT 
            "Clinical Stage" AS x, 
            CAST(COUNT(DISTINCT "Patient ID") AS INTEGER) AS y,
            ROUND(100.0 * COUNT(DISTINCT "Patient ID") / SUM(COUNT(DISTINCT "Patient ID")) OVER (), 2) AS freq
          FROM aurora_us
          ${whereClause}
          GROUP BY x
          ORDER BY y DESC;
        `;
      },
    },
    {
      id: 'pathologic-stage',
      title: 'Pathologic Stage',
      types: ['pie', 'table'],
      filter: {
        column: 'Pathologic Stage',
        type: 'term',
      },
      labels: {
        x: 'Pathologic Stage',
        y: 'Count',
        freq: 'Frequency',
      },
      data: [
        { x: 'Stage IIA', y: 14, freq: 25.45 },
        { x: 'Stage I', y: 12, freq: 21.82 },
        { x: 'Stage IIIC', y: 8, freq: 14.55 },
        { x: 'NA', y: 6, freq: 10.91 },
        { x: 'Stage IIIA', y: 5, freq: 9.09 },
        { x: 'Stage IIB', y: 4, freq: 7.27 },
        { x: 'Unknown', y: 2, freq: 3.64 },
        { x: 'Stage IV', y: 2, freq: 3.64 },
        { x: 'Stage IIIB', y: 2, freq: 3.64 },
      ],
      query: (clause) => {
        const whereClause = clause ? `WHERE ${clause}` : '';
        return `
          SELECT 
            "Pathologic Stage" AS x, 
            CAST(COUNT(DISTINCT "Patient ID") AS INTEGER) AS y,
            ROUND(100.0 * COUNT(DISTINCT "Patient ID") / SUM(COUNT(DISTINCT "Patient ID")) OVER (), 2) AS freq
          FROM aurora_us
          ${whereClause}
          GROUP BY x
          ORDER BY y DESC;
        `;
      },
    },
    {
      id: 'age-at-diagnosis',
      title: 'Age at Diagnosis',
      types: ['histogram'],
      filter: {
        column: 'Age at Diagnosis',
        type: 'range',
      },
      labels: {
        x: 'Age at Diagnosis',
        y: 'Count',
        studyId: 'Study ID',
        patientId: 'Patient ID',
      },
      bins: [
        { value: 0, label: '<=30' },
        { value: 30, label: '30' },
        { value: 35, label: '35' },
        { value: 40, label: '40' },
        { value: 45, label: '45' },
        { value: 50, label: '50' },
        { value: 55, label: '55' },
        { value: 60, label: '60' },
        { value: 65, label: '65' },
        { value: 70, label: '70' },
        { value: 75, label: '>75' },
      ],
      query: (clause) => {
        const whereClause = clause ? `WHERE ${clause}` : '';
        return `
          SELECT "Study ID" AS "studyId", "Patient ID" AS "patientId", x FROM (
            SELECT DISTINCT
              "Study ID",
              "Patient ID",
              "Age at Diagnosis" AS x
            FROM aurora_us
            ${whereClause}
          ) AS one_per_patient;
        `;
      },
    },
    // {
    //   id: 'fraction-genome-altered',
    //   title: 'Fraction Genome Altered',
    //   types: ['histogram'],
    //   filter: {
    //     column: 'Fraction Genome Altered',
    //     type: 'range'
    //   },
    //   labels: {
    //     x: 'Fraction Genome Altered',
    //     y: 'Count',
    //   },
    //   query: (clause) => {
    //     const whereClause = clause ? `AND ${clause}` : '';
    //     return `
    //       SELECT "Fraction Genome Altered" AS x
    //       FROM aurora_us
    //       WHERE x IS NOT NULL ${whereClause};
    //     `;
    //   },
    // },
    {
      id: 'mutation-count-vs-fraction-genome-altered',
      title: 'Mutation Count vs Fraction Genome Altered',
      types: ['scatter'],
      labels: {
        x: 'Fraction Genome Altered',
        y: 'Mutation Count',
      },
      query: (clause) => {
        const whereClause = clause ? `AND ${clause}` : '';
        return `
          SELECT 
            "Fraction Genome Altered" AS x,
            "Mutation Count" AS y
          FROM aurora_us
          WHERE "Fraction Genome Altered" IS NOT NULL 
            AND "Mutation Count" IS NOT NULL
            ${whereClause};
        `;
      },
    },
    {
      id: 'progesterone-receptor-status',
      title: 'Progesterone Receptor Status',
      types: ['pie', 'table'],
      filter: {
        column: 'Progesterone Receptor Status',
        type: 'term',
      },
      labels: {
        x: 'Progesterone Receptor Status',
        y: 'Count',
        freq: 'Frequency',
      },
      query: (clause) => {
        const whereClause = clause ? `WHERE ${clause}` : '';
        return `
          SELECT 
            "Progesterone Receptor Status" AS x, 
            CAST(COUNT(DISTINCT "Patient ID") AS INTEGER) AS y,
            ROUND(100.0 * COUNT(DISTINCT "Patient ID") / SUM(COUNT(DISTINCT "Patient ID")) OVER (), 2) AS freq
          FROM aurora_us
          ${whereClause}
          GROUP BY x
          ORDER BY y DESC;
        `;
      },
    },
    {
      id: 'race',
      title: 'Race',
      types: ['pie', 'table'],
      filter: {
        column: 'Race',
        type: 'term',
      },
      labels: {
        x: 'Race',
        y: 'Count',
        freq: 'Frequency',
      },
      query: (clause) => {
        const whereClause = clause ? `WHERE ${clause}` : '';
        return `
          SELECT 
            "Race" AS x, 
            CAST(COUNT(DISTINCT "Patient ID") AS INTEGER) AS y,
            ROUND(100.0 * COUNT(DISTINCT "Patient ID") / SUM(COUNT(DISTINCT "Patient ID")) OVER (), 2) AS freq
          FROM aurora_us
          ${whereClause}
          GROUP BY x
          ORDER BY y DESC;
        `;
      },
    },
    {
      id: 'pathologic-t-stage',
      title: 'Pathologic T Stage',
      types: ['pie', 'table'],
      filter: {
        column: 'Pathologic T',
        type: 'term',
      },
      labels: {
        x: 'Pathologic T Stage',
        y: 'Count',
        freq: 'Frequency',
      },
      query: (clause) => {
        const whereClause = clause ? `WHERE ${clause}` : '';
        return `
          SELECT 
            "Pathologic T" AS x, 
            CAST(COUNT(DISTINCT "Patient ID") AS INTEGER) AS y,
            ROUND(100.0 * COUNT(DISTINCT "Patient ID") / SUM(COUNT(DISTINCT "Patient ID")) OVER (), 2) AS freq
          FROM aurora_us
          ${whereClause}
          GROUP BY x
          ORDER BY y DESC;
        `;
      },
    },
    {
      id: 'histologic-type',
      title: 'Histologic Type',
      types: ['pie', 'table'],
      filter: {
        column: 'Histologic Type',
        type: 'term',
      },
      labels: {
        x: 'Histologic Type',
        y: 'Count',
        freq: 'Frequency',
      },
      query: (clause) => {
        const whereClause = clause ? `WHERE ${clause}` : '';
        return `
          SELECT 
            "Histologic Type" AS x, 
            CAST(COUNT(DISTINCT "Patient ID") AS INTEGER) AS y,
            ROUND(100.0 * COUNT(DISTINCT "Patient ID") / SUM(COUNT(DISTINCT "Patient ID")) OVER (), 2) AS freq
          FROM aurora_us
          ${whereClause}
          GROUP BY x
          ORDER BY y DESC;
        `;
      },
    },
    {
      id: 'overall-survival-status',
      title: 'Overall Survival Status',
      types: ['pie', 'table'],
      filter: {
        column: 'Overall Survival Status',
        type: 'term',
      },
      labels: {
        x: 'Overall Survival Status',
        y: 'Count',
        freq: 'Frequency',
      },
      query: (clause) => {
        const whereClause = clause ? `WHERE ${clause}` : '';
        return `
          SELECT 
            "Overall Survival Status" AS x, 
            CAST(COUNT(DISTINCT "Patient ID") AS INTEGER) AS y,
            ROUND(100.0 * COUNT(DISTINCT "Patient ID") / SUM(COUNT(DISTINCT "Patient ID")) OVER (), 2) AS freq
          FROM aurora_us
          ${whereClause}
          GROUP BY x
          ORDER BY y DESC;
        `;
      },
    },
    {
      id: 'pathologic-m-stage',
      title: 'Pathologic M Stage',
      types: ['pie', 'table'],
      filter: {
        column: 'Pathologic M',
        type: 'term',
      },
      labels: {
        x: 'Pathologic M Stage',
        y: 'Count',
        freq: 'Frequency',
      },
      query: (clause) => {
        const whereClause = clause ? `WHERE ${clause}` : '';
        return `
          SELECT 
            "Pathologic M" AS x, 
            CAST(COUNT(DISTINCT "Patient ID") AS INTEGER) AS y,
            ROUND(100.0 * COUNT(DISTINCT "Patient ID") / SUM(COUNT(DISTINCT "Patient ID")) OVER (), 2) AS freq
          FROM aurora_us
          ${whereClause}
          GROUP BY x
          ORDER BY y DESC;
        `;
      },
    },
    {
      id: 'pathologic-n-stage',
      title: 'Pathologic N Stage',
      types: ['pie', 'table'],
      filter: {
        column: 'Pathologic N',
        type: 'term',
      },
      labels: {
        x: 'Pathologic N Stage',
        y: 'Count',
        freq: 'Frequency',
      },
      query: (clause) => {
        const whereClause = clause ? `WHERE ${clause}` : '';
        return `
          SELECT 
            "Pathologic N" AS x, 
            CAST(COUNT(DISTINCT "Patient ID") AS INTEGER) AS y,
            ROUND(100.0 * COUNT(DISTINCT "Patient ID") / SUM(COUNT(DISTINCT "Patient ID")) OVER (), 2) AS freq
          FROM aurora_us
          ${whereClause}
          GROUP BY x
          ORDER BY y DESC;
        `;
      },
    },
    {
      id: 'metastatic-site',
      title: 'Metastatic Site',
      types: ['pie', 'table'],
      filter: {
        column: 'Metastatic Site',
        type: 'term',
      },
      labels: {
        y: 'Count',
        freq: 'Frequency',
      },
      query: (clause) => {
        const whereClause = clause ? `WHERE ${clause}` : '';
        return `
          SELECT 
            "Metastatic Site" AS x, 
            CAST(COUNT(*) AS INTEGER) AS y,
            ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 2) AS freq
          FROM aurora_us
          ${whereClause}
          GROUP BY x
          ORDER BY y DESC;
        `;
      },
    },
    {
      id: 'ethnicity',
      title: 'Ethnicity',
      types: ['pie', 'table'],
      filter: {
        column: 'Ethnicity', // column name in the tsv file
        type: 'term', // type of filter: term
      },
      labels: {
        x: 'Ethnicity',
        y: 'Count',
        freq: 'Frequency',
      },
      query: (clause) => {
        const whereClause = clause ? `WHERE ${clause}` : '';
        return `
          SELECT 
            "Ethnicity" AS x, 
            CAST(COUNT(DISTINCT "Patient ID") AS INTEGER) AS y,
            ROUND(100.0 * COUNT(DISTINCT "Patient ID") / SUM(COUNT(DISTINCT "Patient ID")) OVER (), 2) AS freq
          FROM aurora_us
          ${whereClause}
          GROUP BY x
          ORDER BY y DESC; 
        `;
      },
    },
    {
      id: 'did-the-patient-receive-adjuvant-treatment-for-localized-disease',
      title:
        'Did the patient receive adjuvant treatment for localized disease?',
      types: ['pie', 'table'],
      filter: {
        column:
          'Did the patient receive adjuvant treatment for localized disease?', // column name in the tsv file
        type: 'term', // type of filter: term
      },
      labels: {
        x: 'Did the patient receive adjuvant treatment for localized disease?',
        y: 'Count',
        freq: 'Frequency',
      },
      query: (clause) => {
        const whereClause = clause ? `WHERE ${clause}` : '';
        return `
          SELECT 
            "Did the patient receive adjuvant treatment for localized disease?" AS x, 
            CAST(COUNT(DISTINCT "Patient ID") AS INTEGER) AS y,
            ROUND(100.0 * COUNT(DISTINCT "Patient ID") / SUM(COUNT(DISTINCT "Patient ID")) OVER (), 2) AS freq
          FROM aurora_us
          ${whereClause}
          GROUP BY x
          ORDER BY y DESC; 
        `;
      },
    },
    {
      id: 'cancer-type',
      title: 'Cancer Type',
      types: ['pie', 'table'],
      filter: {
        column: 'Cancer Type', // column name in the tsv file
        type: 'term', // type of filter: term
      },
      labels: {
        x: 'Cancer Type',
        y: 'Count',
        freq: 'Frequency',
      },
      query: (clause) => {
        const whereClause = clause ? `WHERE ${clause}` : '';
        return `
          SELECT 
            "Cancer Type" AS x, 
            CAST(COUNT(DISTINCT "Patient ID") AS INTEGER) AS y,
            ROUND(100.0 * COUNT(DISTINCT "Patient ID") / SUM(COUNT(DISTINCT "Patient ID")) OVER (), 2) AS freq
          FROM aurora_us
          ${whereClause}
          GROUP BY x
          ORDER BY y DESC; 
        `;
      },
    },
    {
      id: 'disease-free-status',
      title: 'Disease Free Status',
      types: ['pie', 'table'],
      filter: {
        column: 'Disease Free Status', // column name in the tsv file
        type: 'term', // type of filter: term
      },
      labels: {
        x: 'Disease Free Status',
        y: 'Count',
        freq: 'Frequency',
      },
      query: (clause) => {
        const whereClause = clause ? `WHERE ${clause}` : '';
        return `
          SELECT 
            "Disease Free Status" AS x, 
            CAST(COUNT(DISTINCT "Patient ID") AS INTEGER) AS y,
            ROUND(100.0 * COUNT(DISTINCT "Patient ID") / SUM(COUNT(DISTINCT "Patient ID")) OVER (), 2) AS freq
          FROM aurora_us
          ${whereClause}
          GROUP BY x
          ORDER BY y DESC; 
        `;
      },
    },
    {
      id: 'source-of-tissue-used-for-mutational-profile',
      title: 'Source of tissue used for mutational profile',
      types: ['pie', 'table'],
      filter: {
        column: 'Source of tissue used for mutational profile', // column name in the tsv file
        type: 'term', // type of filter: term
      },
      labels: {
        x: 'Source of tissue used for mutational profile',
        y: 'Count',
        freq: 'Frequency',
      },
      query: (clause) => {
        const whereClause = clause ? `WHERE ${clause}` : '';
        return `
          SELECT 
            "Source of tissue used for mutational profile" AS x, 
            CAST(COUNT(DISTINCT "Patient ID") AS INTEGER) AS y,
            ROUND(100.0 * COUNT(DISTINCT "Patient ID") / SUM(COUNT(DISTINCT "Patient ID")) OVER (), 2) AS freq
          FROM aurora_us
          ${whereClause}
          GROUP BY x
          ORDER BY y DESC; 
        `;
      },
    },
    {
      id: 'number-proliferating-cells',
      title: 'Number Proliferating Cells',
      types: ['pie', 'table'],
      filter: {
        column: 'Number Proliferating Cells', // column name in the tsv file
        type: 'term', // type of filter: term
      },
      labels: {
        x: 'Number Proliferating Cells',
        y: 'Count',
        freq: 'Frequency',
      },
      query: (clause) => {
        const whereClause = clause ? `WHERE ${clause}` : '';
        return `
          SELECT 
            "Number Proliferating Cells" AS x, 
            CAST(COUNT(DISTINCT "Patient ID") AS INTEGER) AS y,
            ROUND(100.0 * COUNT(DISTINCT "Patient ID") / SUM(COUNT(DISTINCT "Patient ID")) OVER (), 2) AS freq
          FROM aurora_us
          ${whereClause}
          GROUP BY x
          ORDER BY y DESC; 
        `;
      },
    },
    {
      id: 'oncotree-code',
      title: 'Oncotree Code',
      types: ['pie', 'table'],
      filter: {
        column: 'Oncotree Code', // column name in the tsv file
        type: 'term', // type of filter: term
      },
      labels: {
        x: 'Oncotree Code',
        y: 'Count',
        freq: 'Frequency',
      },
      query: (clause) => {
        const whereClause = clause ? `WHERE ${clause}` : '';
        return `
          SELECT 
            "Oncotree Code" AS x, 
            CAST(COUNT(DISTINCT "Patient ID") AS INTEGER) AS y,
            ROUND(100.0 * COUNT(DISTINCT "Patient ID") / SUM(COUNT(DISTINCT "Patient ID")) OVER (), 2) AS freq
          FROM aurora_us
          ${whereClause}
          GROUP BY x
          ORDER BY y DESC; 
        `;
      },
    },
    {
      id: 'participating-site',
      title: 'Participating site',
      types: ['pie', 'table'],
      filter: {
        column: 'Participating site', // column name in the tsv file
        type: 'term', // type of filter: term
      },
      query: (clause) => {
        const whereClause = clause ? `WHERE ${clause}` : '';
        return `
          SELECT 
            "Participating site" AS x, 
            CAST(COUNT(DISTINCT "Patient ID") AS INTEGER) AS y,
            ROUND(100.0 * COUNT(DISTINCT "Patient ID") / SUM(COUNT(DISTINCT "Patient ID")) OVER (), 2) AS freq
          FROM aurora_us
          ${whereClause}
          GROUP BY x
          ORDER BY y DESC; 
        `;
      },
    },
    {
      id: 'preservation',
      title: 'Preservation',
      types: ['pie', 'table'],
      filter: {
        column: 'Preservation', // column name in the tsv file
        type: 'term', // type of filter: term
      },
      query: (clause) => {
        const whereClause = clause ? `WHERE ${clause}` : '';
        return `
          SELECT 
            "Preservation" AS x, 
            CAST(COUNT(DISTINCT "Patient ID") AS INTEGER) AS y,
            ROUND(100.0 * COUNT(DISTINCT "Patient ID") / SUM(COUNT(DISTINCT "Patient ID")) OVER (), 2) AS freq
          FROM aurora_us
          ${whereClause}
          GROUP BY x
          ORDER BY y DESC; 
        `;
      },
    },
    {
      id: 'does-the-patient-have-a-second-breast-primary',
      title: 'Does the patient have a second breast primary?',
      types: ['pie', 'table'],
      filter: {
        column: 'Does the patient have a second breast primary?', // column name in the tsv file
        type: 'term', // type of filter: term
      },
      query: (clause) => {
        const whereClause = clause ? `WHERE ${clause}` : '';
        return `
          SELECT 
            "Does the patient have a second breast primary?" AS x, 
            CAST(COUNT(DISTINCT "Patient ID") AS INTEGER) AS y,
            ROUND(100.0 * COUNT(DISTINCT "Patient ID") / SUM(COUNT(DISTINCT "Patient ID")) OVER (), 2) AS freq
          FROM aurora_us
          ${whereClause}
          GROUP BY x
          ORDER BY y DESC; 
        `;
      },
    },
    {
      id: 'estrogen-receptor-status',
      title: 'Estrogen Receptor Status',
      types: ['pie', 'table'],
      filter: {
        column: 'Estrogen Receptor Status', // column name in the tsv file
        type: 'term', // type of filter: term
      },
      query: (clause) => {
        const whereClause = clause ? `WHERE ${clause}` : '';
        return `
          SELECT 
            "Estrogen Receptor Status" AS x, 
            CAST(COUNT(DISTINCT "Patient ID") AS INTEGER) AS y,
            ROUND(100.0 * COUNT(DISTINCT "Patient ID") / SUM(COUNT(DISTINCT "Patient ID")) OVER (), 2) AS freq
          FROM aurora_us
          ${whereClause}
          GROUP BY x
          ORDER BY y DESC; 
        `;
      },
    },
    {
      id: 'primary-tumor-her2-neu-receptor-status-by-ihc',
      title: 'Primary tumor HER2/neu Receptor status by IHC',
      types: ['pie', 'table'],
      filter: {
        column: 'Primary tumor HER2/neu Receptor status by IHC', // column name in the tsv file
        type: 'term', // type of filter: term
      },
      query: (clause) => {
        const whereClause = clause ? `WHERE ${clause}` : '';
        return `
          SELECT 
            "Primary tumor HER2/neu Receptor status by IHC" AS x, 
            CAST(COUNT(DISTINCT "Patient ID") AS INTEGER) AS y,
            ROUND(100.0 * COUNT(DISTINCT "Patient ID") / SUM(COUNT(DISTINCT "Patient ID")) OVER (), 2) AS freq
          FROM aurora_us
          ${whereClause}
          GROUP BY x
          ORDER BY y DESC; 
        `;
      },
    },
    {
      id: 'family-history-of-breast-or-ovarian-cancer',
      title: 'Family history of breast or ovarian cancer?',
      types: ['pie', 'table'],
      filter: {
        column: 'Family history of breast or ovarian cancer?', // column name in the tsv file
        type: 'term', // type of filter: term
      },
      labels: {
        x: 'Family history of breast or ovarian cancer?',
        y: 'Count',
        freq: 'Frequency',
      },
      query: (clause) => {
        const whereClause = clause ? `WHERE ${clause}` : '';
        return `
          SELECT 
            "Family history of breast or ovarian cancer?" AS x, 
            CAST(COUNT(DISTINCT "Patient ID") AS INTEGER) AS y,
            ROUND(100.0 * COUNT(DISTINCT "Patient ID") / SUM(COUNT(DISTINCT "Patient ID")) OVER (), 2) AS freq
          FROM aurora_us
          ${whereClause}
          GROUP BY x
          ORDER BY y DESC; 
        `;
      },
    },
    {
      id: 'is-her2-copy-number-known-primary-tumor',
      title: 'Is HER2 copy number known? (Primary tumor)',
      types: ['pie', 'table'],
      filter: {
        column: 'Is HER2 copy number known? (Primary tumor)', // column name in the tsv file
        type: 'term', // type of filter: term
      },
      labels: {
        x: 'Is HER2 copy number known? (Primary tumor)',
        y: 'Count',
        freq: 'Frequency',
      },
      query: (clause) => {
        const whereClause = clause ? `WHERE ${clause}` : '';
        return `
          SELECT 
            "Is HER2 copy number known? (Primary tumor)" AS x, 
            CAST(COUNT(DISTINCT "Patient ID") AS INTEGER) AS y,
            ROUND(100.0 * COUNT(DISTINCT "Patient ID") / SUM(COUNT(DISTINCT "Patient ID")) OVER (), 2) AS freq
          FROM aurora_us
          ${whereClause}
          GROUP BY x
          ORDER BY y DESC; 
        `;
      },
    },
    {
      id: 'her2-copy-number-for-primary-tumor',
      title: 'HER2 copy number for primary tumor',
      types: ['pie', 'table'],
      filter: {
        column: 'HER2 copy number for primary tumor', // column name in the tsv file
        type: 'term', // type of filter: term
      },
      labels: {
        x: 'HER2 copy number for primary tumor',
        y: 'Count',
        freq: 'Frequency',
      },
      query: (clause) => {
        const whereClause = clause ? `WHERE ${clause}` : '';
        return `
          SELECT 
            "HER2 copy number for primary tumor" AS x, 
            CAST(COUNT(DISTINCT "Patient ID") AS INTEGER) AS y,
            ROUND(100.0 * COUNT(DISTINCT "Patient ID") / SUM(COUNT(DISTINCT "Patient ID")) OVER (), 2) AS freq
          FROM aurora_us
          ${whereClause}
          GROUP BY x
          ORDER BY y DESC; 
        `;
      },
    },
    {
      id: 'primary-tumor-her2-fish',
      title: 'Primary tumor HER2 FISH',
      types: ['pie', 'table'],
      filter: {
        column: 'Primary tumor HER2 FISH', // column name in the tsv file
        type: 'term', // type of filter: term
      },
      labels: {
        x: 'Primary tumor HER2 FISH',
        y: 'Count',
        freq: 'Frequency',
      },
      query: (clause) => {
        const whereClause = clause ? `WHERE ${clause}` : '';
        return `
          SELECT 
            "Primary tumor HER2 FISH" AS x, 
            CAST(COUNT(DISTINCT "Patient ID") AS INTEGER) AS y,
            ROUND(100.0 * COUNT(DISTINCT "Patient ID") / SUM(COUNT(DISTINCT "Patient ID")) OVER (), 2) AS freq
          FROM aurora_us
          ${whereClause}
          GROUP BY x
          ORDER BY y DESC; 
        `;
      },
    },
    {
      id: 'primary-tumor-her2-status-interpretation',
      title: 'Primary tumor HER2 status interpretation',
      types: ['pie', 'table'],
      filter: {
        column: 'Primary tumor HER2 status interpretation', // column name in the tsv file
        type: 'term', // type of filter: term
      },
      labels: {
        x: 'Primary tumor HER2 status interpretation',
        y: 'Count',
        freq: 'Frequency',
      },
      query: (clause) => {
        const whereClause = clause ? `WHERE ${clause}` : '';
        return `
          SELECT 
            "Primary tumor HER2 status interpretation" AS x, 
            CAST(COUNT(DISTINCT "Patient ID") AS INTEGER) AS y,
            ROUND(100.0 * COUNT(DISTINCT "Patient ID") / SUM(COUNT(DISTINCT "Patient ID")) OVER (), 2) AS freq
          FROM aurora_us
          ${whereClause}
          GROUP BY x
          ORDER BY y DESC; 
        `;
      },
    },
    {
      id: 'clinical-m-stage-of-first-primary',
      title: 'Clinical M stage of first primary',
      types: ['pie', 'table'],
      filter: {
        column: 'Clinical M stage of first primary', // column name in the tsv file
        type: 'term', // type of filter: term
      },
      labels: {
        x: 'Clinical M stage of first primary',
        y: 'Count',
        freq: 'Frequency',
      },
      query: (clause) => {
        const whereClause = clause ? `WHERE ${clause}` : '';
        return `
          SELECT 
            "Clinical M stage of first primary" AS x, 
            CAST(COUNT(DISTINCT "Patient ID") AS INTEGER) AS y,
            ROUND(100.0 * COUNT(DISTINCT "Patient ID") / SUM(COUNT(DISTINCT "Patient ID")) OVER (), 2) AS freq
          FROM aurora_us
          ${whereClause}
          GROUP BY x
          ORDER BY y DESC; 
        `;
      },
    },
    {
      id: 'clinical-n-stage-of-first-primary',
      title: 'Clinical N stage of first primary',
      types: ['pie', 'table'],
      filter: {
        column: 'Clinical N stage of first primary', // column name in the tsv file
        type: 'term', // type of filter: term
      },
      labels: {
        x: 'Clinical N stage of first primary',
        y: 'Count',
        freq: 'Frequency',
      },
      query: (clause) => {
        const whereClause = clause ? `WHERE ${clause}` : '';
        return `
          SELECT 
            "Clinical N stage of first primary" AS x, 
            CAST(COUNT(DISTINCT "Patient ID") AS INTEGER) AS y,
            ROUND(100.0 * COUNT(DISTINCT "Patient ID") / SUM(COUNT(DISTINCT "Patient ID")) OVER (), 2) AS freq
          FROM aurora_us
          ${whereClause}
          GROUP BY x
          ORDER BY y DESC; 
        `;
      },
    },
    {
      id: 'did-patient-receive-a-genomic-prognostic-assay-for-this-tumor',
      title: 'Did patient receive a genomic prognostic assay for this tumor?',
      types: ['pie', 'table'],
      filter: {
        column:
          'Did patient receive a genomic prognostic assay for this tumor?', // column name in the tsv file
        type: 'term', // type of filter: term
      },
      labels: {
        x: 'Did patient receive a genomic prognostic assay for this tumor?',
        y: 'Count',
        freq: 'Frequency',
      },
      query: (clause) => {
        const whereClause = clause ? `WHERE ${clause}` : '';
        return `
          SELECT 
            "Did patient receive a genomic prognostic assay for this tumor?" AS x, 
            CAST(COUNT(DISTINCT "Patient ID") AS INTEGER) AS y,
            ROUND(100.0 * COUNT(DISTINCT "Patient ID") / SUM(COUNT(DISTINCT "Patient ID")) OVER (), 2) AS freq
          FROM aurora_us
          ${whereClause}
          GROUP BY x
          ORDER BY y DESC; 
        `;
      },
    },
    {
      id: 'source-of-genomic-prognostic-assay-on-first-primary',
      title: 'Source of genomic prognostic assay on first primary',
      types: ['pie', 'table'],
      filter: {
        column: 'Source of genomic prognostic assay on first primary', // column name in the tsv file
        type: 'term', // type of filter: term
      },
      labels: {
        x: 'Source of genomic prognostic assay on first primary',
        y: 'Count',
        freq: 'Frequency',
      },
      query: (clause) => {
        const whereClause = clause ? `WHERE ${clause}` : '';
        return `
          SELECT 
            "Source of genomic prognostic assay on first primary" AS x, 
            CAST(COUNT(DISTINCT "Patient ID") AS INTEGER) AS y,
            ROUND(100.0 * COUNT(DISTINCT "Patient ID") / SUM(COUNT(DISTINCT "Patient ID")) OVER (), 2) AS freq
          FROM aurora_us
          ${whereClause}
          GROUP BY x
          ORDER BY y DESC; 
        `;
      },
    },
    {
      id: 'clinical-t-stage-of-first-primary',
      title: 'Clinical T stage of first primary',
      types: ['pie', 'table'],
      filter: {
        column: 'Clinical T stage of first primary', // column name in the tsv file
        type: 'term', // type of filter: term
      },
      labels: {
        x: 'Clinical T stage of first primary',
        y: 'Count',
        freq: 'Frequency',
      },
      query: (clause) => {
        const whereClause = clause ? `WHERE ${clause}` : '';
        return `
          SELECT 
            "Clinical T stage of first primary" AS x, 
            CAST(COUNT(DISTINCT "Patient ID") AS INTEGER) AS y,
            ROUND(100.0 * COUNT(DISTINCT "Patient ID") / SUM(COUNT(DISTINCT "Patient ID")) OVER (), 2) AS freq
          FROM aurora_us
          ${whereClause}
          GROUP BY x
          ORDER BY y DESC; 
        `;
      },
    },
    {
      id: 'did-patient-receive-radiation-for-localized-disease',
      title: 'Did patient receive radiation for localized disease?',
      types: ['pie', 'table'],
      filter: {
        column: 'Did patient receive radiation for localized disease?', // column name in the tsv file
        type: 'term', // type of filter: term
      },
      labels: {
        x: 'Did patient receive radiation for localized disease?',
        y: 'Count',
        freq: 'Frequency',
      },
      query: (clause) => {
        const whereClause = clause ? `WHERE ${clause}` : '';
        return `
          SELECT 
            "Did patient receive radiation for localized disease?" AS x, 
            CAST(COUNT(DISTINCT "Patient ID") AS INTEGER) AS y,
            ROUND(100.0 * COUNT(DISTINCT "Patient ID") / SUM(COUNT(DISTINCT "Patient ID")) OVER (), 2) AS freq
          FROM aurora_us
          ${whereClause}
          GROUP BY x
          ORDER BY y DESC; 
        `;
      },
    },
    {
      id: 'did-patient-receive-radiation-for-metastatic-disease',
      title: 'Did patient receive radiation for metastatic disease?',
      types: ['pie', 'table'],
      filter: {
        column: 'Did patient receive radiation for metastatic disease?', // column name in the tsv file
        type: 'term', // type of filter: term
      },
      labels: {
        x: 'Did patient receive radiation for metastatic disease?',
        y: 'Count',
        freq: 'Frequency',
      },
      query: (clause) => {
        const whereClause = clause ? `WHERE ${clause}` : '';
        return `
          SELECT 
            "Did patient receive radiation for metastatic disease?" AS x, 
            CAST(COUNT(DISTINCT "Patient ID") AS INTEGER) AS y,
            ROUND(100.0 * COUNT(DISTINCT "Patient ID") / SUM(COUNT(DISTINCT "Patient ID")) OVER (), 2) AS freq
          FROM aurora_us
          ${whereClause}
          GROUP BY x
          ORDER BY y DESC; 
        `;
      },
    },
    {
      id: 'sample-type',
      title: 'Sample Type',
      types: ['pie', 'table'],
      filter: {
        column: 'Sample_Type', // column name in the tsv file
        type: 'term', // type of filter: term
      },
      labels: {
        x: 'Sample Type',
        y: 'Count',
        freq: 'Frequency',
      },
      query: (clause) => {
        const whereClause = clause ? `WHERE ${clause}` : '';
        // Sample_Type is a sample-level attribute, so count samples rather than distinct patients
        return `
          SELECT 
            "Sample_Type" AS x, 
            CAST(COUNT(*) AS INTEGER) AS y,
            ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 2) AS freq
          FROM aurora_us
          ${whereClause}
          GROUP BY x
          ORDER BY y DESC; 
        `;
      },
    },
    {
      id: 'sex',
      title: 'Sex',
      types: ['pie', 'table'],
      filter: {
        column: 'Sex', // column name in the tsv file
        type: 'term', // type of filter: term
      },
      labels: {
        x: 'Sex',
        y: 'Count',
        freq: 'Frequency',
      },
      query: (clause) => {
        const whereClause = clause ? `WHERE ${clause}` : '';
        return `
          SELECT 
            "Sex" AS x, 
            CAST(COUNT(DISTINCT "Patient ID") AS INTEGER) AS y,
            ROUND(100.0 * COUNT(DISTINCT "Patient ID") / SUM(COUNT(DISTINCT "Patient ID")) OVER (), 2) AS freq
          FROM aurora_us
          ${whereClause}
          GROUP BY x
          ORDER BY y DESC; 
        `;
      },
    },
    {
      id: 'type-of-primary-tumor-final-resection',
      title: 'Type of primary tumor final resection',
      types: ['pie', 'table'],
      filter: {
        column: 'Type of primary tumor final resection', // column name in the tsv file
        type: 'term', // type of filter: term
      },
      labels: {
        x: 'Type of primary tumor final resection',
        y: 'Count',
        freq: 'Frequency',
      },
      query: (clause) => {
        const whereClause = clause ? `WHERE ${clause}` : '';
        return `
          SELECT 
            "Type of primary tumor final resection" AS x, 
            CAST(COUNT(DISTINCT "Patient ID") AS INTEGER) AS y,
            ROUND(100.0 * COUNT(DISTINCT "Patient ID") / SUM(COUNT(DISTINCT "Patient ID")) OVER (), 2) AS freq
          FROM aurora_us
          ${whereClause}
          GROUP BY x
          ORDER BY y DESC; 
        `;
      },
    },
  ],
};
