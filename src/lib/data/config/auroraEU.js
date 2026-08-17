export const CONFIG = {
  id: 'aurora-eu',
  table: 'aurora_eu',
  keyColumn: 'ssid',
  charts: [
    {
      id: 'type',
      title: 'Type',
      types: ['pie', 'table'],
      filter: {
        column: 'type',
        type: 'term',
      },
      labels: {
        x: 'Type',
        y: 'Count',
        freq: 'Frequency',
      },
      query: (clause) => {
        const whereClause = clause ? `WHERE ${clause}` : '';
        // Cast y to integer to avoid returning a string value for count
        return `
          SELECT
            "type" AS x,
            CAST(COUNT(*) AS INTEGER) AS y,
            ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 2) AS freq
          FROM aurora_eu
          ${whereClause}
          GROUP BY x
          ORDER BY y DESC;
        `;
      },
    },
    {
      id: 'pam50-primary',
      title: 'PAM50 Primary',
      types: ['pie', 'table'],
      filter: {
        column: 'PAM50_primary',
        type: 'term',
      },
      labels: {
        x: 'PAM50 Primary',
        y: 'Count',
        freq: 'Frequency',
      },
      query: (clause) => {
        const whereClause = clause ? `WHERE ${clause}` : '';
        // Cast y to integer to avoid returning a string value for count
        return `
          SELECT
            "PAM50_primary" AS x,
            CAST(COUNT(*) AS INTEGER) AS y,
            ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 2) AS freq
          FROM aurora_eu
          ${whereClause}
          GROUP BY x
          ORDER BY y DESC;
        `;
      },
    },
    {
      id: 'pam50-meta',
      title: 'PAM50 Meta',
      types: ['pie', 'table'],
      filter: {
        column: 'PAM50_meta',
        type: 'term',
      },
      labels: {
        x: 'PAM50 Meta',
        y: 'Count',
        freq: 'Frequency',
      },
      query: (clause) => {
        const whereClause = clause ? `WHERE ${clause}` : '';
        // Cast y to integer to avoid returning a string value for count
        return `
          SELECT
            "PAM50_meta" AS x,
            CAST(COUNT(*) AS INTEGER) AS y,
            ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 2) AS freq
          FROM aurora_eu
          ${whereClause}
          GROUP BY x
          ORDER BY y DESC;
        `;
      },
    },
    {
      id: 'ihc-primary',
      title: 'IHC Primary',
      types: ['pie', 'table'],
      filter: {
        column: 'IHC_primary',
        type: 'term',
      },
      labels: {
        x: 'IHC Primary',
        y: 'Count',
        freq: 'Frequency',
      },
      query: (clause) => {
        const whereClause = clause ? `WHERE ${clause}` : '';
        // Cast y to integer to avoid returning a string value for count
        return `
          SELECT
            "IHC_primary" AS x,
            CAST(COUNT(*) AS INTEGER) AS y,
            ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 2) AS freq
          FROM aurora_eu
          ${whereClause}
          GROUP BY x
          ORDER BY y DESC;
        `;
      },
    },
    {
      id: 'ihc-meta',
      title: 'IHC Meta',
      types: ['pie', 'table'],
      filter: {
        column: 'IHC_meta',
        type: 'term',
      },
      labels: {
        x: 'IHC Meta',
        y: 'Count',
        freq: 'Frequency',
      },
      query: (clause) => {
        const whereClause = clause ? `WHERE ${clause}` : '';
        // Cast y to integer to avoid returning a string value for count
        return `
          SELECT
            "IHC_meta" AS x,
            CAST(COUNT(*) AS INTEGER) AS y,
            ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 2) AS freq
          FROM aurora_eu
          ${whereClause}
          GROUP BY x
          ORDER BY y DESC;
        `;
      },
    },
    {
      id: 'metastatic-biopsy-site',
      title: 'Metastatic Biopsy Site',
      types: ['pie', 'table'],
      filter: {
        column: 'metastatic_biopsy_site',
        type: 'term',
      },
      labels: {
        x: 'Metastatic Biopsy Site',
        y: 'Count',
        freq: 'Frequency',
      },
      query: (clause) => {
        const whereClause = clause ? `WHERE ${clause}` : '';
        // Cast y to integer to avoid returning a string value for count
        return `
          SELECT
            "metastatic_biopsy_site" AS x,
            CAST(COUNT(*) AS INTEGER) AS y,
            ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 2) AS freq
          FROM aurora_eu
          ${whereClause}
          GROUP BY x
          ORDER BY y DESC;
        `;
      },
    },
    {
      id: 'is-de-novo',
      title: 'Is De Novo',
      types: ['pie', 'table'],
      filter: {
        column: 'is_de_novo',
        type: 'term',
      },
      labels: {
        x: 'Is De Novo',
        y: 'Count',
        freq: 'Frequency',
      },
      query: (clause) => {
        const whereClause = clause ? `WHERE ${clause}` : '';
        // Cast y to integer to avoid returning a string value for count
        return `
          SELECT
            "is_de_novo" AS x,
            CAST(COUNT(*) AS INTEGER) AS y,
            ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 2) AS freq
          FROM aurora_eu
          ${whereClause}
          GROUP BY x
          ORDER BY y DESC;
      `;
      },
    },
    {
      id: 'adjuvant',
      title: 'Adjuvant',
      types: ['pie', 'table'],
      filter: {
        column: 'adjuvant',
        type: 'term',
      },
      labels: {
        x: 'Adjuvant',
        y: 'Count',
        freq: 'Frequency',
      },
      query: (clause) => {
        const whereClause = clause ? `WHERE ${clause}` : '';
        // Cast y to integer to avoid returning a string value for count
        return `
          SELECT
            "adjuvant" AS x,
            CAST(COUNT(*) AS INTEGER) AS y,
            ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 2) AS freq
          FROM aurora_eu
          ${whereClause}
          GROUP BY x
          ORDER BY y DESC;
        `;
      },
    },
    {
      id: 'neoadjuvant',
      title: 'Neoadjuvant',
      types: ['pie', 'table'],
      filter: {
        column: 'neoadjuvant',
        type: 'term',
      },
      labels: {
        x: 'Neoadjuvant',
        y: 'Count',
        freq: 'Frequency',
      },
      query: (clause) => {
        const whereClause = clause ? `WHERE ${clause}` : '';
        // Cast y to integer to avoid returning a string value for count
        return `
          SELECT
            "neoadjuvant" AS x,
            CAST(COUNT(*) AS INTEGER) AS y,
            ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 2) AS freq
          FROM aurora_eu
          ${whereClause}
          GROUP BY x
          ORDER BY y DESC;
        `;
      },
    },
    {
      id: 'block-before-or-after-neo-treatment',
      title: 'Block Before Or After Neo Treatment',
      types: ['pie', 'table'],
      filter: {
        column: 'block_before_or_after_neo_treatment',
        type: 'term',
      },
      labels: {
        x: 'Block Before Or After Neo Treatment',
        y: 'Count',
        freq: 'Frequency',
      },
      query: (clause) => {
        const whereClause = clause ? `WHERE ${clause}` : '';
        // Cast y to integer to avoid returning a string value for count
        return `
          SELECT
            "block_before_or_after_neo_treatment" AS x,
            CAST(COUNT(*) AS INTEGER) AS y,
            ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 2) AS freq
          FROM aurora_eu
          ${whereClause}
          GROUP BY x
          ORDER BY y DESC;
        `;
      },
    },
    {
      id: 'metastatic-tx-lines-before-aurora',
      title: 'Metastatic Tx Lines Before Aurora',
      types: ['pie', 'table'],
      filter: {
        column: 'metastatic_tx_lines_before_aurora',
        type: 'term',
      },
      labels: {
        x: 'Metastatic Tx Lines Before Aurora',
        y: 'Count',
        freq: 'Frequency',
      },
      query: (clause) => {
        const whereClause = clause ? `WHERE ${clause}` : '';
        // Cast y to integer to avoid returning a string value for count
        return `
          SELECT
            "metastatic_tx_lines_before_aurora" AS x,
            CAST(COUNT(*) AS INTEGER) AS y,
            ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 2) AS freq
          FROM aurora_eu
          ${whereClause}
          GROUP BY x
          ORDER BY y DESC;
        `;
      },
    },
    {
      id: 'num-metastatic-sites-at-inclusion',
      title: 'Num Metastatic Sites At Inclusion',
      types: ['pie', 'table'],
      filter: {
        column: 'num_metastatic_sites_at_inclusion',
        type: 'term',
      },
      labels: {
        x: 'Num Metastatic Sites At Inclusion',
        y: 'Count',
        freq: 'Frequency',
      },
      query: (clause) => {
        const whereClause = clause ? `WHERE ${clause}` : '';
        return `
          SELECT
            "num_metastatic_sites_at_inclusion" AS x,
            CAST(COUNT(*) AS INTEGER) AS y,
            ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 2) AS freq
          FROM aurora_eu
          ${whereClause}
          GROUP BY x
          ORDER BY y DESC;
        `;
      },
    },
    {
      id: 'primary-grade',
      title: 'Primary Grade',
      types: ['pie', 'table'],
      filter: {
        column: 'primary_grade',
        type: 'term',
      },
      labels: {
        x: 'Primary Grade',
        y: 'Count',
        freq: 'Frequency',
      },
      query: (clause) => {
        const whereClause = clause ? `WHERE ${clause}` : '';
        return `
          SELECT
            "primary_grade" AS x,
            CAST(COUNT(*) AS INTEGER) AS y,
            ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 2) AS freq
          FROM aurora_eu
          ${whereClause}
          GROUP BY x
          ORDER BY y DESC;
        `;
      },
    },
    {
      id: 'primary-patho-node-status',
      title: 'Primary Patho Node Status',
      types: ['pie', 'table'],
      filter: {
        column: 'primary_patho_node_status',
        type: 'term',
      },
      labels: {
        x: 'Primary Patho Node Status',
        y: 'Count',
        freq: 'Frequency',
      },
      query: (clause) => {
        const whereClause = clause ? `WHERE ${clause}` : '';
        // Cast y to integer to avoid returning a string value for count
        return `
          SELECT
            "primary_patho_node_status" AS x,
            CAST(COUNT(*) AS INTEGER) AS y,
            ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 2) AS freq
          FROM aurora_eu
          ${whereClause}
          GROUP BY x
          ORDER BY y DESC;
        `;
      },
    },
    {
      id: 'primary-size-t1-or-t2',
      title: 'Primary Size T1 Or T2',
      types: ['pie', 'table'],
      filter: {
        column: 'primary_size_t1_or_t2',
        type: 'term',
      },
      labels: {
        x: 'Primary Size T1 Or T2',
        y: 'Count',
        freq: 'Frequency',
      },
      query: (clause) => {
        const whereClause = clause ? `WHERE ${clause}` : '';
        // Cast y to integer to avoid returning a string value for count
        return `
          SELECT
            "primary_size_t1_or_t2" AS x,
            CAST(COUNT(*) AS INTEGER) AS y,
            ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 2) AS freq
          FROM aurora_eu
          ${whereClause}
          GROUP BY x
          ORDER BY y DESC;
        `;
      },
    },
    {
      id: 'overall-survival-days',
      title: 'Overall Survival Days',
      types: ['histogram'],
      filter: {
        column: 'overall_survival_days',
        type: 'range',
      },
      labels: {
        x: 'Overall Survival Days',
        y: 'Count',
        ssid: 'ssid',
      },
      bins: [
        { value: 0, label: '<=100' },
        { value: 100, label: '100' },
        { value: 200, label: '200' },
        { value: 300, label: '300' },
        { value: 400, label: '400' },
        { value: 500, label: '500' },
        { value: 600, label: '600' },
        { value: 700, label: '700' },
        { value: 800, label: '800' },
        { value: 900, label: '900' },
        { value: 1000, label: '1000' },
        { value: 1100, label: '1100' },
        { value: 1200, label: '1200' },
        { value: 1300, label: '1300' },
        { value: 1400, label: '1400' },
        { value: 1500, label: '1500' },
        { value: 1600, label: '1600' },
        { value: 1700, label: '1700' },
        { value: 1800, label: '1800' },
        { value: 1900, label: '1900' },
        { value: 2000, label: '>2000' },
      ],
      query: (clause) => {
        const whereClause = clause ? `AND ${clause}` : '';
        return `
          SELECT "ssid" AS "ssid", "overall_survival_days" AS x
          FROM aurora_eu
          WHERE x IS NOT NULL
          ${whereClause};
        `;
      },
    },
    {
      id: 'death-events',
      title: 'Death Events',
      types: ['pie', 'table'],
      filter: {
        column: 'death_events',
        type: 'term',
      },
      labels: {
        x: 'Death Events',
        y: 'Count',
        freq: 'Frequency',
      },
      query: (clause) => {
        const whereClause = clause ? `WHERE ${clause}` : '';
        return `
          SELECT
            "death_events" AS x,
            CAST(COUNT(*) AS INTEGER) AS y,
            ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 2) AS freq
          FROM aurora_eu
          ${whereClause}
          GROUP BY x
          ORDER BY y DESC;
        `;
      },
    },
    {
      id: 'time-to-metastatic-relapse-days',
      title: 'Time To Metastatic Relapse Days',
      types: ['histogram'],
      filter: {
        column: 'time_to_metastatic_relapse_days',
        type: 'range',
      },
      labels: {
        x: 'Time To Metastatic Relapse Days',
        y: 'Count',
        ssid: 'SSID',
      },
      bins: [
        { value: 0, label: '<=200' },
        { value: 200, label: '200' },
        { value: 400, label: '400' },
        { value: 600, label: '600' },
        { value: 800, label: '800' },
        { value: 1000, label: '1000' },
        { value: 1200, label: '1200' },
        { value: 1400, label: '1400' },
        { value: 1600, label: '1600' },
        { value: 1800, label: '1800' },
        { value: 2000, label: '2000' },
        { value: 2200, label: '2200' },
        { value: 2400, label: '2400' },
        { value: 2600, label: '2600' },
        { value: 2800, label: '2800' },
        { value: 3000, label: '3000' },
        { value: 3200, label: '3200' },
        { value: 3400, label: '3400' },
        { value: 3600, label: '3600' },
        { value: 3800, label: '3800' },
        { value: 4000, label: '>4000' },
      ],
      query: (clause) => {
        const whereClause = clause ? `AND ${clause}` : '';
        // Cast y to integer to avoid returning a string value for count
        return `
          SELECT "ssid" AS "ssid", "time_to_metastatic_relapse_days" AS x
          FROM aurora_eu
          WHERE x IS NOT NULL
          ${whereClause};
        `;
      },
    },
    {
      id: 'patient-in-oncoplot',
      title: 'Patient In Oncoplot',
      types: ['pie', 'table'],
      filter: {
        column: 'patient_in_oncoplot',
        type: 'term',
      },
      labels: {
        x: 'Patient In Oncoplot',
        y: 'Count',
        freq: 'Frequency',
      },
      query: (clause) => {
        const whereClause = clause ? `WHERE ${clause}` : '';
        // Cast y to integer to avoid returning a string value for count
        return `
          SELECT
            "patient_in_oncoplot" AS x,
            CAST(COUNT(*) AS INTEGER) AS y,
            ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 2) AS freq
          FROM aurora_eu
          ${whereClause}
          GROUP BY x
          ORDER BY y DESC;
        `;
      },
    },
  ],
};
