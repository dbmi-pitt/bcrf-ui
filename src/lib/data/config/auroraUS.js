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
      tooltip: "Cancer Type Detailed Tooltip Text",
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
      id: 'overall-survival',
      title: 'Overall Survival',
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
  ],
};
