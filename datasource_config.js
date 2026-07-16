export const CONFIG = {
  id: 'aurora_us',
  charts: [
    {
      id: 'ethnicity',
      title: 'Ethnicity',
      types: ['pie', 'table'],
      filterColumn: 'Ethnicity', // column name in the tsv file
      labels: {
        x: 'Ethnicity',
        y: 'Count', // label key maps to the data key in the data array
        freq: 'Frequency',
      },
      data: [
        { x: 'Not Hispanic/Latina', y: 121, freq: 78.06 },
        { x: 'Unknown', y: 23, freq: 14.84 },
        { x: 'Hispanic/Latina', y: 11, freq: 7.1 },
      ],
      query: `
        SELECT 
          "Ethnicity" AS x, 
          COUNT(*) AS y,
          ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 2) AS freq
        FROM aurora_us
        GROUP BY x
        ORDER BY y DESC; 
      `,
    },
    {
      id: 'age_at_diagnosis',
      title: 'Age at Diagnosis',
      types: ['histogram'],
      filterColumn: 'Age at Diagnosis',
      labels: {
        x: 'Age at Diagnosis',
        y: 'Count',
      },
      data: [
        { x: 20.0, y: 4 },
        { x: 30.0, y: 14 },
        { x: 40.0, y: 59 },
        { x: 50.0, y: 36 },
        { x: 60.0, y: 29 },
        { x: 70.0, y: 13 },
      ],
      query: `
        SELECT 
          FLOOR("Age at Diagnosis" / 10) * 10 AS x,
          COUNT(*) AS y
        FROM aurora_us
        GROUP BY x
        ORDER BY x;
      `,
    },
    {
      id: 'mutation_count_vs_fraction_genome_altered',
      title: 'Mutation Count vs Fraction Genome Altered',
      types: ['scatter'],
      labels: {
        x: 'Fraction Genome Altered',
        y: 'Mutation Count',
      },
      data: [
        { x: 0.9998, y: 46 },
        { x: 0.9996, y: 78 },
        { x: 0.9992, y: 69 },
        { x: 0.9982, y: 98 },
        { x: 0.9996, y: 291 },
        { x: 0.9992, y: 50 },
        { x: 0.9997, y: 1008 },
        { x: 0.9957, y: 969 },
        { x: 0.9998, y: 979 },
        { x: 0.9997, y: 1557 },
        { x: 0.9994, y: 16 },
        { x: 0.9987, y: 20 },
        { x: 0.9998, y: 1343 },
        { x: 0.9996, y: 157 },
        { x: 0.9995, y: 57 },
        { x: 0.9988, y: 57 },
        { x: 0.9998, y: 1258 },
        { x: 0.9993, y: 78 },
        { x: 0.9993, y: 93 },
        { x: 0.9998, y: 68 },
        { x: 0.9997, y: 82 },
        { x: 0.9997, y: 74 },
        { x: 0.9998, y: 212 },
        { x: 0.9996, y: 79 },
        { x: 0.9998, y: 68 },
        { x: 0.9997, y: 10 },
        { x: 0.9993, y: 47 },
        { x: 0.9991, y: 21 },
        { x: 0.9993, y: 1962 },
        { x: 0.9996, y: 130 },
        { x: 0.9997, y: 103 },
        { x: 0.9999, y: 1498 },
        { x: 0.9998, y: 224 },
        { x: 0.9998, y: 288 },
        { x: 0.9999, y: 259 },
        { x: 0.9993, y: 278 },
        { x: 0.9998, y: 257 },
        { x: 0.9992, y: 293 },
        { x: 0.9991, y: 94 },
        { x: 0.9919, y: 107 },
        { x: 0.9981, y: 107 },
        { x: 0.9985, y: 97 },
        { x: 0.9988, y: 90 },
        { x: 0.9991, y: 101 },
        { x: 0.9994, y: 136 },
        { x: 0.9985, y: 124 },
        { x: 0.9988, y: 101 },
        { x: 0.9999, y: 1480 },
        { x: 0.9993, y: 149 },
        { x: 0.9995, y: 126 },
        { x: 0.9981, y: 193 },
        { x: 0.9969, y: 197 },
        { x: 0.9923, y: 172 },
        { x: 0.9984, y: 194 },
        { x: 0.9996, y: 129 },
        { x: 0.9993, y: 117 },
        { x: 0.9994, y: 6 },
        { x: 0.9993, y: 56 },
        { x: 0.9994, y: 33 },
        { x: 0.9996, y: 160 },
        { x: 0.9998, y: 135 },
        { x: 0.9997, y: 122 },
        { x: 0.9997, y: 125 },
        { x: 0.9997, y: 596 },
        { x: 0.9997, y: 4899 },
        { x: 0.9996, y: 33 },
        { x: 0.9991, y: 35 },
        { x: 0.9997, y: 30 },
        { x: 0.9997, y: 17 },
        { x: 0.9997, y: 31 },
        { x: 0.9993, y: 154 },
        { x: 0.9992, y: 2509 },
        { x: 0.9991, y: 58 },
        { x: 0.999, y: 101 },
        { x: 0.9991, y: 845 },
        { x: 0.9992, y: 367 },
        { x: 0.9998, y: 26 },
        { x: 0.9997, y: 99 },
        { x: 0.9999, y: 1094 },
        { x: 0.9998, y: 113 },
        { x: 0.9997, y: 283 },
        { x: 0.9999, y: 1773 },
        { x: 0.9998, y: 807 },
        { x: 0.9999, y: 528 },
        { x: 0.9999, y: 59 },
        { x: 0.9991, y: 58 },
        { x: 0.9995, y: 274 },
        { x: 0.9995, y: 470 },
        { x: 0.9997, y: 72 },
        { x: 0.9996, y: 105 },
        { x: 0.9999, y: 17 },
        { x: 0.9997, y: 61 },
        { x: 0.999, y: 62 },
        { x: 0.9987, y: 110 },
        { x: 0.9996, y: 1752 },
        { x: 0.9993, y: 93 },
        { x: 0.999, y: 1687 },
        { x: 0.9932, y: 137 },
        { x: 0.9993, y: 1346 },
        { x: 0.9983, y: 102 },
        { x: 0.9999, y: 672 },
        { x: 0.9999, y: 104 },
        { x: 0.9995, y: 1389 },
        { x: 0.998, y: 149 },
        { x: 0.9999, y: 52 },
        { x: 0.9998, y: 36 },
        { x: 0.9985, y: 146 },
        { x: 0.9997, y: 661 },
        { x: 0.9996, y: 33 },
        { x: 0.9997, y: 103 },
        { x: 0.9998, y: 388 },
        { x: 0.9997, y: 107 },
        { x: 0.999, y: 122 },
        { x: 0.999, y: 51 },
        { x: 0.9991, y: 44 },
        { x: 0.9996, y: 56 },
        { x: 0.9996, y: 47 },
        { x: 0.9994, y: 684 },
        { x: 0.9988, y: 125 },
        { x: 0.9998, y: 649 },
        { x: 0.999, y: 68 },
        { x: 0.9998, y: 341 },
        { x: 0.9999, y: 695 },
        { x: 0.9997, y: 858 },
        { x: 0.9999, y: 1860 },
      ],

      query: `
        SELECT 
          "Fraction Genome Altered" AS x,
          "Mutation Count" AS y
        FROM aurora_us
        WHERE "Fraction Genome Altered" IS NOT NULL 
          AND "Mutation Count" IS NOT NULL
      `,
    },
    {
      id: 'cancer_type_detailed',
      title: 'Cancer Type Detailed',
      types: ['pie', 'table'],
      filterColumn: 'Cancer Type Detailed',
      labels: {
        x: 'Cancer Type',
        y: 'Count',
        freq: 'Frequency',
      },
      data: [
        { x: 'Breast Invasive Ductal Carcinoma', y: 83, freq: 53.55 },
        { x: 'Invasive Breast Carcinoma', y: 59, freq: 38.06 },
        { x: 'Breast Mixed Ductal and Lobular Carcinoma', y: 7, freq: 4.52 },
        { x: 'Breast Invasive Lobular Carcinoma', y: 6, freq: 3.87 },
      ],
      query: `
        SELECT 
          "Cancer Type Detailed" AS x,
          COUNT(*) AS y,
          ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 2) AS freq
        FROM aurora_us
        GROUP BY x
        ORDER BY y DESC
      `,
    },
    {
      id: 'race',
      title: 'Race',
      types: ['pie', 'table'],
      filterColumn: 'Race',
      labels: {
        y: 'Count',
        freq: 'Frequency',
      },
      data: [
        { x: 'White', y: 116, freq: 74.84 },
        { x: 'Black or African American', y: 23, freq: 14.84 },
        { x: 'Unknown', y: 10, freq: 6.45 },
        { x: 'Other', y: 4, freq: 2.58 },
        { x: 'Asian', y: 2, freq: 1.29 },
      ],
      query: `
        SELECT 
          "Race" AS x, 
          COUNT(*) AS y,
          ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 2) AS freq
        FROM aurora_us
        GROUP BY x
        ORDER BY y DESC;
      `,
    },
  ],
};
