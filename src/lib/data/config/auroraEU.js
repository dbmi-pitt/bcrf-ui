export const CONFIG = {
  id: 'aurora_eu',
  charts: [
    {
      id: 'type',
      title: 'Type',
      types: ['pie', 'table'],
      filterColumn: 'type', // column name in the tsv file
      labels: {
        y: 'Count', // label key maps to the data key in the data array
        freq: 'Frequency',
      },
      data: [
        { x: 'HR+/HER2-', y: 244, freq: 65.77 },
        { x: 'TNBC', y: 69, freq: 18.6 },
        { x: 'HER2+', y: 58, freq: 15.63 },
      ],
      query: `
        SELECT 
          "type" AS x, 
          COUNT(*) AS y,
          ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 2) AS freq
        FROM aurora_eu
        GROUP BY x
        ORDER BY y DESC;
      `,
    },
    {
      id: 'pam50_primary',
      title: 'PAM50 Primary',
      types: ['pie', 'table'],
      filterColumn: 'PAM50_primary',
      labels: {
        y: 'Count',
        freq: 'Frequency',
      },
      data: [
        { x: 'N/A', y: 164, freq: 44.2 },
        { x: 'LumB', y: 77, freq: 20.75 },
        { x: 'Basal', y: 51, freq: 13.75 },
        { x: 'LumA', y: 46, freq: 12.4 },
        { x: 'Her2', y: 24, freq: 6.47 },
        { x: 'Normal', y: 9, freq: 2.43 },
      ],
      query: `
        SELECT
          "PAM50_primary" AS x,
          COUNT(*) AS y,
          ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 2) AS freq
        FROM aurora_eu
        GROUP BY x
        ORDER BY y DESC;
      `,
    },
    {
      id: 'metastatic_biopsy_site',
      title: 'Metastatic Biopsy Site',
      types: ['pie', 'table'],
      filterColumn: 'metastatic_biopsy_site',
      labels: {
        y: 'Count',
        freq: 'Frequency',
      },
      data: [
        { x: 'Liver', y: 148, freq: 39.89 },
        { x: 'Lymph node', y: 99, freq: 26.68 },
        { x: 'Skin', y: 29, freq: 7.82 },
        { x: 'Lung', y: 20, freq: 5.39 },
        { x: 'Breast', y: 18, freq: 4.85 },
        { x: 'Other', y: 13, freq: 3.5 },
        { x: 'Chest wall', y: 10, freq: 2.7 },
        { x: 'Soft tissue', y: 9, freq: 2.43 },
        { x: 'N/A', y: 9, freq: 2.43 },
        { x: 'Pleura', y: 7, freq: 1.89 },
        { x: 'Brain', y: 5, freq: 1.35 },
        { x: 'Abdominal wall', y: 2, freq: 0.54 },
        { x: 'Ovary', y: 2, freq: 0.54 },
      ],
      query: `
        SELECT
          "metastatic_biopsy_site" AS x,
          COUNT(*) AS y,
          ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 2) AS freq
        FROM aurora_eu
        GROUP BY x
        ORDER BY y DESC;
      `,
    },
  ],
};
