export const CONFIG = {
  id: 'upmc-ehr-bc-data-mart',
  table: 'upmc_ehr_bc_data_mart',
  keyColumn: 'PATIENT_STUDY_ID',
  dataTypes: [],
  charts: [
    {
      id: 'sex-desc',
      title: 'Sex',
      types: ['pie', 'table'],
      filter: {
        column: 'SEX_DESC',
        type: 'term',
      },
      labels: {
        x: 'Sex',
        y: 'Count',
        freq: 'Frequency',
      },
      query: (clause) => {
        const whereClause = clause ? `WHERE ${clause}` : '';
        // Cast y to integer to avoid returning a string value for count
        return `
                SELECT
                  "SEX_DESC" AS x,
                  CAST(COUNT(*) AS INTEGER) AS y,
                  ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 2) AS freq
                FROM upmc_ehr_bc_data_mart
                ${whereClause}
                GROUP BY x
                ORDER BY y DESC;
                `;
      },
    },
    {
      id: 'race-1-desc',
      title: 'Race',
      types: ['pie', 'table'],
      filter: {
        column: 'RACE_1_DESC',
        type: 'term',
      },
      labels: {
        x: 'Race',
        y: 'Count',
        freq: 'Frequency',
      },
      query: (clause) => {
        const whereClause = clause ? `WHERE ${clause}` : '';
        // Cast y to integer to avoid returning a string value for count
        return `
                SELECT
                  "RACE_1_DESC" AS x,
                  CAST(COUNT(*) AS INTEGER) AS y,
                  ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 2) AS freq
                FROM upmc_ehr_bc_data_mart
                ${whereClause}
                GROUP BY x
                ORDER BY y DESC;
                `;
      },
    },
    {
      id: 'spanish-hisp-orig-desc',
      title: 'Origin',
      types: ['pie', 'table'],
      filter: {
        column: 'SPANISH_HISP_ORIG_DESC',
        type: 'term',
      },
      labels: {
        x: 'Origin',
        y: 'Count',
        freq: 'Frequency',
      },
      query: (clause) => {
        const whereClause = clause ? `WHERE ${clause}` : '';
        // Cast y to integer to avoid returning a string value for count
        return `
                SELECT
                  "SPANISH_HISP_ORIG_DESC" AS x,
                  CAST(COUNT(*) AS INTEGER) AS y,
                  ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 2) AS freq
                FROM upmc_ehr_bc_data_mart
                ${whereClause}
                GROUP BY x
                ORDER BY y DESC;
                `;
      },
    },
    {
      id: 'primary-site-desc',
      title: 'Primary Site',
      types: ['pie', 'table'],
      filter: {
        column: 'PRIMARY_SITE_DESC',
        type: 'term',
      },
      labels: {
        x: 'Primary Site',
        y: 'Count',
        freq: 'Frequency',
      },
      query: (clause) => {
        const whereClause = clause ? `WHERE ${clause}` : '';
        // Cast y to integer to avoid returning a string value for count
        return `
                SELECT
                  "PRIMARY_SITE_DESC" AS x,
                  CAST(COUNT(*) AS INTEGER) AS y,
                  ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 2) AS freq
                FROM upmc_ehr_bc_data_mart
                ${whereClause}
                GROUP BY x
                ORDER BY y DESC;
                `;
      },
    },
    {
      id: 'histo-behave-icdo3-desc',
      title: 'Histology',
      types: ['pie', 'table'],
      filter: {
        column: 'HISTO_BEHAVE_ICDO3_DESC',
        type: 'term',
      },
      labels: {
        x: 'Histology',
        y: 'Count',
        freq: 'Frequency',
      },
      query: (clause) => {
        const whereClause = clause ? `WHERE ${clause}` : '';
        // Cast y to integer to avoid returning a string value for count
        return `
                SELECT
                  "HISTO_BEHAVE_ICDO3_DESC" AS x,
                  CAST(COUNT(*) AS INTEGER) AS y,
                  ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 2) AS freq
                FROM upmc_ehr_bc_data_mart
                ${whereClause}
                GROUP BY x
                ORDER BY y DESC;
                `;
      },
    },
    {
      id: 'corrected-best-stage',
      title: 'Corrected Best Stage',
      types: ['pie', 'table'],
      filter: {
        column: 'CORRECTED_BEST_STAGE',
        type: 'term',
      },
      labels: {
        x: 'Corrected Best Stage',
        y: 'Count',
        freq: 'Frequency',
      },
      query: (clause) => {
        const whereClause = clause ? `WHERE ${clause}` : '';
        // Cast y to integer to avoid returning a string value for count
        return `
                SELECT
                  "CORRECTED_BEST_STAGE" AS x,
                  CAST(COUNT(*) AS INTEGER) AS y,
                  ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 2) AS freq
                FROM upmc_ehr_bc_data_mart
                ${whereClause}
                GROUP BY x
                ORDER BY y DESC;
                `;
      },
    },
    {
      id: 'site-spec1-er',
      title: 'ER',
      types: ['pie', 'table'],
      filter: {
        column: 'SiteSpec1-ER',
        type: 'term',
      },
      labels: {
        x: 'CS Site-Specific Factor 1',
        y: 'Count',
        freq: 'Frequency',
      },
      query: (clause) => {
        const whereClause = clause ? `WHERE ${clause}` : '';
        // Cast y to integer to avoid returning a string value for count
        return `
                SELECT
                  "SiteSpec1-ER" AS x,
                  CAST(COUNT(*) AS INTEGER) AS y,
                  ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 2) AS freq
                FROM upmc_ehr_bc_data_mart
                ${whereClause}
                GROUP BY x
                ORDER BY y DESC;
                `;
      },
    },
    {
      id: 'site-spec2-pr',
      title: 'PR',
      types: ['pie', 'table'],
      filter: {
        column: 'SiteSpec2-PR',
        type: 'term',
      },
      labels: {
        x: 'CS Site-Specific Factor 2',
        y: 'Count',
        freq: 'Frequency',
      },
      query: (clause) => {
        const whereClause = clause ? `WHERE ${clause}` : '';
        // Cast y to integer to avoid returning a string value for count
        return `
                SELECT
                  "SiteSpec2-PR" AS x,
                  CAST(COUNT(*) AS INTEGER) AS y,
                  ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 2) AS freq
                FROM upmc_ehr_bc_data_mart
                ${whereClause}
                GROUP BY x
                ORDER BY y DESC;
                `;
      },
    },
    {
      id: 'HER2',
      title: 'CS Site-Specific Factor 15',
      types: ['pie', 'table'],
      filter: {
        column: 'SiteSpec15-HER2',
        type: 'term',
      },
      labels: {
        x: 'CS Site-Specific Factor 15',
        y: 'Count',
        freq: 'Frequency',
      },
      query: (clause) => {
        const whereClause = clause ? `WHERE ${clause}` : '';
        // Cast y to integer to avoid returning a string value for count
        return `
                SELECT
                  "SiteSpec15-HER2" AS x,
                  CAST(COUNT(*) AS INTEGER) AS y,
                  ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 2) AS freq
                FROM upmc_ehr_bc_data_mart
                ${whereClause}
                GROUP BY x
                ORDER BY y DESC;
                `;
      },
    },
    {
      id: 'ajcc-clinical-t-desc',
      title: 'AJCC Clinical T Description',
      types: ['pie', 'table'],
      filter: {
        column: 'AJCC_CLINICAL_T_DESC',
        type: 'term',
      },
      labels: {
        x: 'AJCC Clinical T Description',
        y: 'Count',
        freq: 'Frequency',
      },
      query: (clause) => {
        const whereClause = clause ? `WHERE ${clause}` : '';
        // Cast y to integer to avoid returning a string value for count
        return `
                SELECT
                  COALESCE(
                    NULLIF(TRIM("AJCC_CLINICAL_T_DESC"), ''),
                    'Unknown/Not Reported'
                  ) AS x,
                  CAST(COUNT(*) AS INTEGER) AS y,
                  ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 2) AS freq
                FROM upmc_ehr_bc_data_mart
                ${whereClause}
                GROUP BY x
                ORDER BY y DESC;
                `;
      },
    },
    {
      id: 'short-ajjc-t-category',
      title: 'Short AJJC T Category',
      types: ['pie', 'table'],
      filter: {
        column: 'Short AJJC T Category',
        type: 'term',
      },
      labels: {
        x: 'Short AJJC T Category',
        y: 'Count',
        freq: 'Frequency',
      },
      query: (clause) => {
        const whereClause = clause ? `WHERE ${clause}` : '';
        // Cast y to integer to avoid returning a string value for count
        return `
                SELECT
                  "Short AJJC T Category" AS x,
                  CAST(COUNT(*) AS INTEGER) AS y,
                  ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 2) AS freq
                FROM upmc_ehr_bc_data_mart
                ${whereClause}
                GROUP BY x
                ORDER BY y DESC;
                `;
      },
    },
    {
      id: 'ajcc-clinical-n-desc',
      title: 'AJCC Clinical N Description',
      types: ['pie', 'table'],
      filter: {
        column: 'AJCC_CLINICAL_N_DESC',
        type: 'term',
      },
      labels: {
        x: 'AJCC Clinical N Description',
        y: 'Count',
        freq: 'Frequency',
      },
      query: (clause) => {
        const whereClause = clause ? `WHERE ${clause}` : '';
        // Cast y to integer to avoid returning a string value for count
        return `
                SELECT
                  COALESCE(
                    NULLIF(TRIM("AJCC_CLINICAL_N_DESC"), ''),
                    'Unknown/Not Reported'
                  ) AS x,
                  CAST(COUNT(*) AS INTEGER) AS y,
                  ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 2) AS freq
                FROM upmc_ehr_bc_data_mart
                ${whereClause}
                GROUP BY x
                ORDER BY y DESC;
                `;
      },
    },
    {
      id: 'ajcc-clinical-m-desc',
      title: 'AJCC Clinical M Description',
      types: ['pie', 'table'],
      filter: {
        column: 'AJCC_CLINICAL_M_DESC',
        type: 'term',
      },
      labels: {
        x: 'AJCC Clinical M Description',
        y: 'Count',
        freq: 'Frequency',
      },
      query: (clause) => {
        const whereClause = clause ? `WHERE ${clause}` : '';
        // Cast y to integer to avoid returning a string value for count
        return `
                SELECT
                  COALESCE(
                    NULLIF(TRIM("AJCC_CLINICAL_M_DESC"), ''),
                    'Unknown/Not Reported'
                  ) AS x,
                  CAST(COUNT(*) AS INTEGER) AS y,
                  ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 2) AS freq
                FROM upmc_ehr_bc_data_mart
                ${whereClause}
                GROUP BY x
                ORDER BY y DESC;
                `;
      },
    },
    {
      id: 'histology-grade',
      title: 'Histology Grade',
      types: ['pie', 'table'],
      filter: {
        column: 'HISTOLOGY_GRADE',
        type: 'term',
      },
      labels: {
        x: 'Histology Grade',
        y: 'Count',
        freq: 'Frequency',
      },
      query: (clause) => {
        const whereClause = clause ? `WHERE ${clause}` : '';
        // Cast y to integer to avoid returning a string value for count
        return `
                SELECT
                  COALESCE(
                    NULLIF(TRIM("HISTOLOGY_GRADE"), ''),
                    'Unknown/Not Reported'
                  ) AS x,
                  CAST(COUNT(*) AS INTEGER) AS y,
                  ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 2) AS freq
                FROM upmc_ehr_bc_data_mart
                ${whereClause}
                GROUP BY x
                ORDER BY y DESC;
                `;
      },
    },
  ],
};
