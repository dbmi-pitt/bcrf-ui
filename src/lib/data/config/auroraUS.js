export const CONFIG = {
  id: 'aurora-us',
  table: 'aurora_us',
  charts: [
    {
      id: 'cancer-type-detailed',
      title: 'Cancer Type Detailed',
      types: ['pie', 'table'],
      filterColumn: 'Cancer Type Detailed',
      labels: {
        y: 'Count',
        freq: 'Frequency',
      },
      data: [
        { x: 'Breast Invasive Ductal Carcinoma', y: 83, freq: 53.55 },
        { x: 'Invasive Breast Carcinoma', y: 59, freq: 38.06 },
        { x: 'Breast Mixed Ductal and Lobular Carcinoma', y: 7, freq: 4.52 },
        { x: 'Breast Invasive Lobular Carcinoma', y: 6, freq: 3.87 },
      ],
      query: (clause) => {
        const whereClause = clause ? `WHERE ${clause}` : '';
        return `
          SELECT 
            "Cancer Type Detailed" AS x,
            COUNT(*) AS y,
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
      filterColumn: 'Mutation Count',
      labels: {
        x: 'Mutation',
        y: 'Count',
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
        { value: 800, label: '800' },
        { value: 10000, label: '>800' },
      ],
      data: [
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AE5G',
          sampleId: 'AUR-493-1-02',
          x: 46,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AE5G',
          sampleId: 'AUR-493-1-03',
          x: 78,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AE5H',
          sampleId: 'AUR-493-4-02',
          x: 69,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AE5H',
          sampleId: 'AUR-493-4-03',
          x: 98,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AFKB',
          sampleId: 'AUR-_500_04_01',
          x: 291,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AFKB',
          sampleId: 'AUR-_500_04_02',
          x: 50,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AD9E',
          sampleId: 'AUR_01_01_01',
          x: 26,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AD9E',
          sampleId: 'AUR_01_01_03',
          x: 24,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AD9E',
          sampleId: 'AUR_01_01_05',
          x: 36,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AD9G',
          sampleId: 'AUR_01_03_01',
          x: 102,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AD9G',
          sampleId: 'AUR_01_03_02',
          x: 386,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AD9G',
          sampleId: 'AUR_01_03_04',
          x: 373,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AD9G',
          sampleId: 'AUR_01_03_06',
          x: 291,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AD9I',
          sampleId: 'AUR_01_05_03',
          x: 112,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AER2',
          sampleId: 'AUR_01_07_01',
          x: 1008,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AER2',
          sampleId: 'AUR_01_07_03',
          x: 969,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AER2',
          sampleId: 'AUR_01_07_05',
          x: 979,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AER4',
          sampleId: 'AUR_01_09_01',
          x: 1557,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AER4',
          sampleId: 'AUR_01_09_03',
          x: 16,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AER4',
          sampleId: 'AUR_01_09_04',
          x: 20,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AER5',
          sampleId: 'AUR_01_10_01',
          x: 1343,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AER5',
          sampleId: 'AUR_01_10_03',
          x: 157,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AER5',
          sampleId: 'AUR_01_10_08',
          x: 57,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AER5',
          sampleId: 'AUR_01_10_09',
          x: 57,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AER6',
          sampleId: 'AUR_01_11_01',
          x: 1258,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AER6',
          sampleId: 'AUR_01_11_03',
          x: 78,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AER6',
          sampleId: 'AUR_01_11_04',
          x: 93,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AER6',
          sampleId: 'AUR_01_11_05',
          x: 68,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AER6',
          sampleId: 'AUR_01_11_07',
          x: 82,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AER6',
          sampleId: 'AUR_01_11_08',
          x: 74,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AER6',
          sampleId: 'AUR_01_11_09',
          x: 212,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AER6',
          sampleId: 'AUR_01_11_11',
          x: 79,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AER6',
          sampleId: 'AUR_01_11_12',
          x: 68,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AER7',
          sampleId: 'AUR_01_12_03',
          x: 10,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AER7',
          sampleId: 'AUR_01_12_04',
          x: 47,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AER7',
          sampleId: 'AUR_01_12_06',
          x: 21,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AER8',
          sampleId: 'AUR_01_13_01',
          x: 1962,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AER8',
          sampleId: 'AUR_01_13_03',
          x: 130,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AER8',
          sampleId: 'AUR_01_13_04',
          x: 103,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AFE4',
          sampleId: 'AUR_01_14_01',
          x: 1498,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AFE4',
          sampleId: 'AUR_01_14_03',
          x: 224,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AFE4',
          sampleId: 'AUR_01_14_04',
          x: 288,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AFE4',
          sampleId: 'AUR_01_14_05',
          x: 259,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AFE4',
          sampleId: 'AUR_01_14_06',
          x: 278,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AFE4',
          sampleId: 'AUR_01_14_07',
          x: 257,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AFE4',
          sampleId: 'AUR_01_14_08',
          x: 293,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AFE5',
          sampleId: 'AUR_01_15_03',
          x: 94,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AFE5',
          sampleId: 'AUR_01_15_04',
          x: 107,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AFE5',
          sampleId: 'AUR_01_15_06',
          x: 107,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AFE5',
          sampleId: 'AUR_01_15_07',
          x: 97,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AFE5',
          sampleId: 'AUR_01_15_08',
          x: 90,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AFE5',
          sampleId: 'AUR_01_15_09',
          x: 101,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AFE5',
          sampleId: 'AUR_01_15_10',
          x: 136,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AFE5',
          sampleId: 'AUR_01_15_11',
          x: 124,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AFE5',
          sampleId: 'AUR_01_15_12',
          x: 101,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AFE6',
          sampleId: 'AUR_01_16_01',
          x: 1480,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AFE6',
          sampleId: 'AUR_01_16_03',
          x: 149,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AFE6',
          sampleId: 'AUR_01_16_04',
          x: 126,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AFE7',
          sampleId: 'AUR_01_17_02',
          x: 193,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AFE7',
          sampleId: 'AUR_01_17_04',
          x: 197,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AFE7',
          sampleId: 'AUR_01_17_05',
          x: 172,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AFE7',
          sampleId: 'AUR_01_17_06',
          x: 194,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AFE9',
          sampleId: 'AUR_01_19_01',
          x: 129,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AFE9',
          sampleId: 'AUR_01_19_03',
          x: 117,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AFE9',
          sampleId: 'AUR_01_19_04',
          x: 6,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AFE9',
          sampleId: 'AUR_01_19_05',
          x: 56,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AFE9',
          sampleId: 'AUR_01_19_06',
          x: 33,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AFEA',
          sampleId: 'AUR_01_20_03',
          x: 160,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AFEA',
          sampleId: 'AUR_01_20_04',
          x: 135,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AFEA',
          sampleId: 'AUR_01_20_05',
          x: 122,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AFEA',
          sampleId: 'AUR_01_20_06',
          x: 125,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AFEA',
          sampleId: 'AUR_01_20_08',
          x: 962,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AFEA',
          sampleId: 'AUR_01_20_09',
          x: 596,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AFEC',
          sampleId: 'AUR_01_22_01',
          x: 4899,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AFEC',
          sampleId: 'AUR_01_22_04',
          x: 33,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AFEC',
          sampleId: 'AUR_01_22_06',
          x: 35,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AFEC',
          sampleId: 'AUR_01_22_07',
          x: 30,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AFEC',
          sampleId: 'AUR_01_22_08',
          x: 17,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AFEC',
          sampleId: 'AUR_01_22_09',
          x: 31,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-ADCB',
          sampleId: 'AUR_03_409-2-01',
          x: 154,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-ADCB',
          sampleId: 'AUR_03_409-2-02',
          x: 2509,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AG0M',
          sampleId: 'AUR_03_549-11_03',
          x: 58,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AG0N',
          sampleId: 'AUR_03_549-12_03',
          x: 101,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AG12',
          sampleId: 'AUR_03_549-19_01',
          x: 845,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AG12',
          sampleId: 'AUR_03_549-19_03',
          x: 367,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AE6X',
          sampleId: 'AUR_03_549-2_01',
          x: 26,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AE6X',
          sampleId: 'AUR_03_549-2_03',
          x: 99,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AE6Y',
          sampleId: 'AUR_03_549-3_01',
          x: 1094,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AE6Y',
          sampleId: 'AUR_03_549-3_03',
          x: 113,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AERW',
          sampleId: 'AUR_03_549-5_03',
          x: 283,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AERW',
          sampleId: 'AUR_03_549-5_05',
          x: 1773,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AERX',
          sampleId: 'AUR_03_549-6_01',
          x: 807,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AERY',
          sampleId: 'AUR_03_549-7_01',
          x: 528,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AERY',
          sampleId: 'AUR_03_549-7_03',
          x: 59,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AG0J',
          sampleId: 'AUR_03_549-8_03',
          x: 58,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AFR2',
          sampleId: 'AUR_06_01_01',
          x: 274,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AFR2',
          sampleId: 'AUR_06_01_03',
          x: 470,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AFR3',
          sampleId: 'AUR_06_02_01',
          x: 72,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AFR3',
          sampleId: 'AUR_06_02_03',
          x: 105,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AFR4',
          sampleId: 'AUR_06_03_01',
          x: 17,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AFR4',
          sampleId: 'AUR_06_03_03',
          x: 61,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AFR5',
          sampleId: 'AUR_06_05_01',
          x: 62,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AFR5',
          sampleId: 'AUR_06_05_03',
          x: 110,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AF94',
          sampleId: 'AUR_13_676-1_01',
          x: 1752,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AF94',
          sampleId: 'AUR_13_676-1_03',
          x: 93,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AF95',
          sampleId: 'AUR_13_676-2_01',
          x: 1687,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AF95',
          sampleId: 'AUR_13_676-2_03',
          x: 137,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AF98',
          sampleId: 'AUR_13_676-5_01',
          x: 1346,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AF98',
          sampleId: 'AUR_13_676-5_03',
          x: 102,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AF99',
          sampleId: 'AUR_13_676-6_01',
          x: 672,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AF99',
          sampleId: 'AUR_13_676-6_03',
          x: 104,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AF9A',
          sampleId: 'AUR_13_676-7_01',
          x: 1389,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AF9A',
          sampleId: 'AUR_13_676-7_03',
          x: 149,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AEPZ',
          sampleId: 'AUR_500_02_01',
          x: 52,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AEPZ',
          sampleId: 'AUR_500_02_02',
          x: 36,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AFKF',
          sampleId: 'AUR_500_03_01',
          x: 146,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AFKF',
          sampleId: 'AUR_500_03_02',
          x: 661,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AFKD',
          sampleId: 'AUR_500_06_01',
          x: 33,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AFKD',
          sampleId: 'AUR_500_06_02',
          x: 103,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AFUP',
          sampleId: 'AUR_5_412-10_01',
          x: 388,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AFUP',
          sampleId: 'AUR_5_412-10_03',
          x: 107,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AFUG',
          sampleId: 'AUR_5_412-1_03',
          x: 122,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AFUI',
          sampleId: 'AUR_5_412-3_01',
          x: 51,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AFUI',
          sampleId: 'AUR_5_412-3_03',
          x: 44,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AFUK',
          sampleId: 'AUR_5_412-5_03',
          x: 56,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AFUK',
          sampleId: 'AUR_5_412-5_05',
          x: 47,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AFUM',
          sampleId: 'AUR_5_412-7_01',
          x: 684,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AFUM',
          sampleId: 'AUR_5_412-7_03',
          x: 125,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AFUN',
          sampleId: 'AUR_5_412-8_01',
          x: 649,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AFUN',
          sampleId: 'AUR_5_412-8_03',
          x: 68,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AFSO',
          sampleId: 'AUR_Duke_01_11',
          x: 341,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AFSL',
          sampleId: 'AUR_Duke_05_18',
          x: 695,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AFSL',
          sampleId: 'AUR_Duke_05_27',
          x: 858,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AG0J',
          sampleId: 'BS14-E19700_A4',
          x: 1860,
        },
      ],
      query: (clause) => {
        const whereClause = clause ? `AND ${clause}` : '';
        return `
          SELECT "Mutation Count" AS x
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
      data: [
        { x: 2, y: 33, freq: 60.0 },
        { x: 3, y: 8, freq: 14.55 },
        { x: 1, y: 4, freq: 7.27 },
        { x: 4, y: 4, freq: 7.27 },
        { x: 7, y: 3, freq: 5.45 },
        { x: 9, y: 1, freq: 1.82 },
        { x: 5, y: 1, freq: 1.82 },
        { x: 10, y: 1, freq: 1.82 },
      ],
      query: (clause) => {
        const whereClause = clause ? `WHERE ${clause}` : '';
        return `
          SELECT 
            "Number of Samples Per Patient" AS x,
            COUNT(DISTINCT "Patient ID") AS y,
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
      filterColumn: 'Clinical Stage',
      labels: {
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
            COUNT(DISTINCT "Patient ID") AS y,
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
      filterColumn: 'Pathologic Stage',
      labels: {
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
            COUNT(DISTINCT "Patient ID") AS y,
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
      filterColumn: 'Age at Diagnosis',
      labels: {
        x: 'Age at Diagnosis',
        y: 'Count',
        studyId: 'Study ID',
        patientId: 'Patient ID',
      },
      bins: [
        { value: 0, label: '<=30' },
        { value: 30, label: '30' },
        { value: 40, label: '40' },
        { value: 50, label: '50' },
        { value: 60, label: '60' },
        { value: 70, label: '70' },
        { value: 80, label: '80' },
        { value: 200, label: '>80' },
      ],
      data: [
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AD9I',
          x: 66.70277778,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AERW',
          x: 40.76388889,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AFSO',
          x: 49.68333333,
        },
        { studyId: 'brca_aurora_2023', patientId: 'AUR-AE5H', x: 60.275 },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AER6',
          x: 54.86111111,
        },
        { studyId: 'brca_aurora_2023', patientId: 'AUR-AERX', x: 39.5 },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AFKD',
          x: 42.51666667,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AG0M',
          x: 44.45833333,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AE6X',
          x: 55.53333333,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AFR2',
          x: 55.99166667,
        },
        { studyId: 'brca_aurora_2023', patientId: 'AUR-AFKB', x: 44.15 },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AD9F',
          x: 58.99166667,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AE6Y',
          x: 45.85555556,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AERY',
          x: 51.60277778,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AD9J',
          x: 48.94166667,
        },
        { studyId: 'brca_aurora_2023', patientId: 'AUR-AFE6', x: 65.875 },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AF95',
          x: 47.78333333,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AFKF',
          x: 52.64722222,
        },
        { studyId: 'brca_aurora_2023', patientId: 'AUR-AE5G', x: 32.425 },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AER8',
          x: 57.18888889,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AG12',
          x: 59.94444444,
        },
        { studyId: 'brca_aurora_2023', patientId: 'AUR-AG0J', x: 39.275 },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AEPZ',
          x: 59.91944444,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AD9H',
          x: 48.74722222,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AFE9',
          x: 48.34722222,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AF94',
          x: 69.53888889,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AF99',
          x: 60.73333333,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AFUL',
          x: 42.83055556,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AD9E',
          x: 38.47222222,
        },
        { studyId: 'brca_aurora_2023', patientId: 'AUR-AFR3', x: 50.35 },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AFR4',
          x: 47.41111111,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AFSL',
          x: 45.82777778,
        },
        { studyId: 'brca_aurora_2023', patientId: 'AUR-AD9G', x: 52.0 },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AF98',
          x: 28.96666667,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AFUK',
          x: 74.41666667,
        },
        { studyId: 'brca_aurora_2023', patientId: 'AUR-AFE4', x: 65.175 },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AFSP',
          x: 37.99166667,
        },
        { studyId: 'brca_aurora_2023', patientId: 'AUR-AER2', x: 42.225 },
        { studyId: 'brca_aurora_2023', patientId: 'AUR-AER5', x: 47.3 },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AG0N',
          x: 65.61111111,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AFUG',
          x: 76.16666667,
        },
        { studyId: 'brca_aurora_2023', patientId: 'AUR-AFUM', x: 25.5 },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AFE7',
          x: 63.30833333,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AFR5',
          x: 60.86111111,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AFUP',
          x: 41.33333333,
        },
        { studyId: 'brca_aurora_2023', patientId: 'AUR-AFUN', x: 50.0 },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AER4',
          x: 30.93888889,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-ADCB',
          x: 42.04444444,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AF9A',
          x: 71.63333333,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AFUI',
          x: 44.91666667,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AER7',
          x: 63.78055556,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AFE5',
          x: 44.56666667,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AFEA',
          x: 47.35277778,
        },
        {
          studyId: 'brca_aurora_2023',
          patientId: 'AUR-AFEC',
          x: 71.16666667,
        },
        { studyId: 'brca_aurora_2023', patientId: 'AUR-AFUO', x: 57.5 },
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
    //   filterColumn: 'Fraction Genome Altered',
    //   labels: {
    //     x: 'Fraction Genome Altered',
    //     y: 'Count',
    //   },
    //   data: [
    //     { x: 0.9998 },
    //     { x: 0.9996 },
    //     { x: 0.9992 },
    //     { x: 0.9982 },
    //     { x: 0.9996 },
    //     { x: 0.9992 },
    //     { x: 0.9997 },
    //     { x: 0.9957 },
    //     { x: 0.9998 },
    //     { x: 0.9997 },
    //     { x: 0.9994 },
    //     { x: 0.9987 },
    //     { x: 0.9998 },
    //     { x: 0.9996 },
    //     { x: 0.9995 },
    //     { x: 0.9988 },
    //     { x: 0.9998 },
    //     { x: 0.9993 },
    //     { x: 0.9993 },
    //     { x: 0.9998 },
    //     { x: 0.9997 },
    //     { x: 0.9997 },
    //     { x: 0.9998 },
    //     { x: 0.9996 },
    //     { x: 0.9998 },
    //     { x: 0.9995 },
    //     { x: 0.9997 },
    //     { x: 0.9993 },
    //     { x: 0.9991 },
    //     { x: 0.9993 },
    //     { x: 0.9996 },
    //     { x: 0.9997 },
    //     { x: 0.9999 },
    //     { x: 0.9998 },
    //     { x: 0.9998 },
    //     { x: 0.9999 },
    //     { x: 0.9993 },
    //     { x: 0.9998 },
    //     { x: 0.9992 },
    //     { x: 0.999 },
    //     { x: 0.9991 },
    //     { x: 0.9919 },
    //     { x: 0.9981 },
    //     { x: 0.9985 },
    //     { x: 0.9988 },
    //     { x: 0.9991 },
    //     { x: 0.9994 },
    //     { x: 0.9985 },
    //     { x: 0.9988 },
    //     { x: 0.9999 },
    //     { x: 0.9993 },
    //     { x: 0.9995 },
    //     { x: 0.9981 },
    //     { x: 0.9969 },
    //     { x: 0.9923 },
    //     { x: 0.9984 },
    //     { x: 0.9996 },
    //     { x: 0.9993 },
    //     { x: 0.9994 },
    //     { x: 0.9993 },
    //     { x: 0.9994 },
    //     { x: 0.9999 },
    //     { x: 0.9996 },
    //     { x: 0.9998 },
    //     { x: 0.9997 },
    //     { x: 0.9997 },
    //     { x: 0.9997 },
    //     { x: 0.9997 },
    //     { x: 0.9996 },
    //     { x: 0.9991 },
    //     { x: 0.9997 },
    //     { x: 0.9997 },
    //     { x: 0.9997 },
    //     { x: 0.9993 },
    //     { x: 0.9992 },
    //     { x: 0.9991 },
    //     { x: 0.999 },
    //     { x: 0.9991 },
    //     { x: 0.9992 },
    //     { x: 0.9998 },
    //     { x: 0.9997 },
    //     { x: 0.9999 },
    //     { x: 0.9998 },
    //     { x: 0.9997 },
    //     { x: 0.9999 },
    //     { x: 0.9998 },
    //     { x: 0.9996 },
    //     { x: 0.9999 },
    //     { x: 0.9999 },
    //     { x: 0.9991 },
    //     { x: 0.9995 },
    //     { x: 0.9995 },
    //     { x: 0.9997 },
    //     { x: 0.9996 },
    //     { x: 0.9999 },
    //     { x: 0.9997 },
    //     { x: 0.999 },
    //     { x: 0.9987 },
    //     { x: 0.9996 },
    //     { x: 0.9993 },
    //     { x: 0.999 },
    //     { x: 0.9932 },
    //     { x: 0.9993 },
    //     { x: 0.9983 },
    //     { x: 0.9999 },
    //     { x: 0.9999 },
    //     { x: 0.9995 },
    //     { x: 0.998 },
    //     { x: 0.9999 },
    //     { x: 0.9998 },
    //     { x: 0.9985 },
    //     { x: 0.9997 },
    //     { x: 0.9996 },
    //     { x: 0.9997 },
    //     { x: 0.9998 },
    //     { x: 0.9997 },
    //     { x: 0.999 },
    //     { x: 0.999 },
    //     { x: 0.9991 },
    //     { x: 0.9996 },
    //     { x: 0.9996 },
    //     { x: 0.9996 },
    //     { x: 0.9994 },
    //     { x: 0.9988 },
    //     { x: 0.9998 },
    //     { x: 0.999 },
    //     { x: 0.9998 },
    //     { x: 0.9998 },
    //     { x: 0.9998 },
    //     { x: 0.9998 },
    //     { x: 0.9999 },
    //     { x: 0.9997 },
    //     { x: 0.9999 },
    //     { x: 0.9993 },
    //     { x: 0.9997 },
    //   ],
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
      filterColumn: 'Progesterone Receptor Status',
      labels: {
        y: 'Count',
        freq: 'Frequency',
      },
      data: [
        { x: 'Negative', y: 28, freq: 50.91 },
        { x: 'Positive', y: 25, freq: 45.45 },
        { x: 'Unknown', y: 2, freq: 3.64 },
      ],
      query: (clause) => {
        const whereClause = clause ? `WHERE ${clause}` : '';
        return `
          SELECT 
            "Progesterone Receptor Status" AS x, 
            COUNT(DISTINCT "Patient ID") AS y,
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
      filterColumn: 'Race',
      labels: {
        y: 'Count',
        freq: 'Frequency',
      },
      data: [
        { x: 'White', y: 37, freq: 67.27 },
        { x: 'Black or African American', y: 10, freq: 18.18 },
        { x: 'Unknown', y: 5, freq: 9.09 },
        { x: 'Other', y: 2, freq: 3.64 },
        { x: 'Asian', y: 1, freq: 1.82 },
      ],
      query: (clause) => {
        const whereClause = clause ? `WHERE ${clause}` : '';
        return `
          SELECT 
            "Race" AS x, 
            COUNT(DISTINCT "Patient ID") AS y,
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
      filterColumn: 'Pathologic T',
      labels: {
        y: 'Count',
        freq: 'Frequency',
      },
      data: [
        { x: 'pT2', y: 21, freq: 38.18 },
        { x: 'pT1', y: 18, freq: 32.73 },
        { x: 'NA', y: 6, freq: 10.91 },
        { x: 'pT4', y: 5, freq: 9.09 },
        { x: 'pT3', y: 3, freq: 5.45 },
        { x: 'Unknown', y: 2, freq: 3.64 },
      ],
      query: (clause) => {
        const whereClause = clause ? `WHERE ${clause}` : '';
        return `
          SELECT 
            "Pathologic T" AS x, 
            COUNT(DISTINCT "Patient ID") AS y,
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
      filterColumn: 'Histologic Type',
      labels: {
        y: 'Count',
        freq: 'Frequency',
      },
      data: [
        { x: 'Infiltrating Ductal Carcinoma', y: 35, freq: 63.64 },
        { x: 'Other histology', y: 14, freq: 25.45 },
        { x: 'Infiltrating Lobular Carcinoma', y: 3, freq: 5.45 },
        { x: 'Mixed Ductal and Lobular Carcinoma', y: 3, freq: 5.45 },
      ],
      query: (clause) => {
        const whereClause = clause ? `WHERE ${clause}` : '';
        return `
          SELECT 
            "Histologic Type" AS x, 
            COUNT(DISTINCT "Patient ID") AS y,
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
      filterColumn: 'Overall Survival Status',
      labels: {
        y: 'Count',
        freq: 'Frequency',
      },
      data: [
        { x: '1:DECEASED', y: 46, freq: 83.64 },
        { x: '0:LIVING', y: 9, freq: 16.36 },
      ],
      query: (clause) => {
        const whereClause = clause ? `WHERE ${clause}` : '';
        return `
          SELECT 
            "Overall Survival Status" AS x, 
            COUNT(DISTINCT "Patient ID") AS y,
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
      filterColumn: 'Pathologic M',
      labels: {
        y: 'Count',
        freq: 'Frequency',
      },
      data: [
        { x: 'M0', y: 37, freq: 67.27 },
        { x: 'Mx', y: 9, freq: 16.36 },
        { x: 'NA', y: 6, freq: 10.91 },
        { x: 'M1', y: 2, freq: 3.64 },
        { x: 'Unknown', y: 1, freq: 1.82 },
      ],
      query: (clause) => {
        const whereClause = clause ? `WHERE ${clause}` : '';
        return `
          SELECT 
            "Pathologic M" AS x, 
            COUNT(DISTINCT "Patient ID") AS y,
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
      filterColumn: 'Pathologic N',
      labels: {
        y: 'Count',
        freq: 'Frequency',
      },
      data: [
        { x: 'pN0', y: 21, freq: 38.18 },
        { x: 'pN1', y: 9, freq: 16.36 },
        { x: 'pN3', y: 8, freq: 14.55 },
        { x: 'pN2', y: 8, freq: 14.55 },
        { x: 'NA', y: 6, freq: 10.91 },
        { x: 'Unknown', y: 2, freq: 3.64 },
        { x: 'pNx', y: 1, freq: 1.82 },
      ],
      query: (clause) => {
        const whereClause = clause ? `WHERE ${clause}` : '';
        return `
          SELECT 
            "Pathologic N" AS x, 
            COUNT(DISTINCT "Patient ID") AS y,
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
      filterColumn: 'Metastatic Site',
      labels: {
        y: 'Count',
        freq: 'Frequency',
      },
      data: [
        { x: 'NA', y: 61, freq: 39.35 },
        { x: 'Brain', y: 7, freq: 4.52 },
        { x: 'Left Liver', y: 5, freq: 3.23 },
        { x: 'Chest Wall', y: 5, freq: 3.23 },
        { x: 'Right Liver', y: 4, freq: 2.58 },
        { x: 'Lung', y: 4, freq: 2.58 },
        { x: 'Adrenal', y: 3, freq: 1.94 },
        { x: 'Soft Tissue', y: 3, freq: 1.94 },
        { x: 'Right Lower Lobe Lung', y: 3, freq: 1.94 },
        { x: 'Left Lung', y: 3, freq: 1.94 },
        { x: 'Hilum', y: 2, freq: 1.29 },
        { x: 'Skin', y: 2, freq: 1.29 },
        { x: 'Rectum', y: 1, freq: 0.65 },
        { x: 'Left Cerebellum', y: 1, freq: 0.65 },
        { x: 'Right Inferior Lobe Liver', y: 1, freq: 0.65 },
        { x: 'Peritoneum/Peribronchial', y: 1, freq: 0.65 },
        { x: 'Right Occipital', y: 1, freq: 0.65 },
        { x: 'Bone (Non-Decalcified)', y: 1, freq: 0.65 },
        { x: 'Distant/Metastatic Lymph Node', y: 1, freq: 0.65 },
        { x: 'Peritoneum', y: 1, freq: 0.65 },
        { x: 'Supraclavicular Lymph Nodes', y: 1, freq: 0.65 },
        { x: 'Peripancreatic #1 (Head)', y: 1, freq: 0.65 },
        { x: 'Liver #2', y: 1, freq: 0.65 },
        { x: 'Anterior Calvarium Periosteum', y: 1, freq: 0.65 },
        { x: 'Right Diaphragm', y: 1, freq: 0.65 },
        { x: 'Spleen', y: 1, freq: 0.65 },
        { x: 'Mediastinum', y: 1, freq: 0.65 },
        { x: 'Right Mediastinum', y: 1, freq: 0.65 },
        { x: 'Uterus', y: 1, freq: 0.65 },
        { x: 'Stomach Antrum', y: 1, freq: 0.65 },
        { x: 'Parasternal Soft Tissue Mass', y: 1, freq: 0.65 },
        { x: 'Dura', y: 1, freq: 0.65 },
        { x: 'Soft Tissue From Anterior Thorax/Chest', y: 1, freq: 0.65 },
        { x: 'Left Hemidiaphragm', y: 1, freq: 0.65 },
        { x: 'Right Upper Arm', y: 1, freq: 0.65 },
        { x: 'Right Lower Lung Lobe/Pleura', y: 1, freq: 0.65 },
        { x: 'Left Axillary Lymph Node (Contralateral)', y: 1, freq: 0.65 },
        { x: 'Ovary', y: 1, freq: 0.65 },
        { x: 'Supraclavicular Lymph Node', y: 1, freq: 0.65 },
        { x: 'Left Pleura', y: 1, freq: 0.65 },
        { x: 'Right Supraclavicular Lymph Node', y: 1, freq: 0.65 },
        { x: 'Right Inframammary Lymph Node', y: 1, freq: 0.65 },
        { x: 'Lymph Node', y: 1, freq: 0.65 },
        { x: 'Kidney', y: 1, freq: 0.65 },
        { x: 'Pericardial', y: 1, freq: 0.65 },
        { x: 'Liver #1', y: 1, freq: 0.65 },
        { x: 'Falciform Ligament (Liver)', y: 1, freq: 0.65 },
        { x: 'Pleura/Pleural Effusion', y: 1, freq: 0.65 },
        { x: 'Right Trapezius (Skin)', y: 1, freq: 0.65 },
        { x: 'Left Upper Lobe Lung #1', y: 1, freq: 0.65 },
        { x: 'Left Inferior Thyroid', y: 1, freq: 0.65 },
      ],
      query: (clause) => {
        const whereClause = clause ? `WHERE ${clause}` : '';
        return `
          SELECT 
            "Metastatic Site" AS x, 
            COUNT(*) AS y,
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
      filterColumn: 'Ethnicity', // column name in the tsv file
      labels: {
        y: 'Count', // label key maps to the data key in the data array
        freq: 'Frequency',
      },
      data: [
        { x: 'Not Hispanic/Latina', y: 40, freq: 72.73 },
        { x: 'Unknown', y: 11, freq: 20.0 },
        { x: 'Hispanic/Latina', y: 4, freq: 7.27 },
      ],
      query: (clause) => {
        const whereClause = clause ? `WHERE ${clause}` : '';
        return `
          SELECT 
            "Ethnicity" AS x, 
            COUNT(DISTINCT "Patient ID") AS y,
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
