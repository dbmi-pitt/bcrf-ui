export const summaryDataSources = [
    {
      source: 'aurora-combined',
      name: 'Aurora US + EU (Combined Facets)',
      description:
        'A semantic crosswalk between Aurora US and Aurora EU metadata, built for faceted search across both cohorts. No field names or value sets were identical between the two studies, so every row below reflects a judgment call about clinical equivalence rather than a literal rename. Each common_field lists a canonical name/value set, plus a per-source translation showing the original field name and how each original value maps onto the canonical value. Fields with no reasonable counterpart in the other study are listed separately under unmapped_fields rather than forced into a false equivalence.',
      common_fields: [
        {
          name: 'Molecular Subtype (Clinical IHC)',
          values: ['HER2+', 'HR+/HER2-', 'TNBC', 'Unknown'],
          notes:
            'EU reports this directly as a single categorical field. US does not report a single subtype field, so it must be derived by combining ER, PR, and HER2 status: HER2 positive -> HER2+; HER2 negative with ER or PR positive -> HR+/HER2-; HER2 negative with ER and PR both negative -> TNBC; anything with an Unknown component -> Unknown.',
          sources: {
            'aurora-us': {
              field:
                'Derived from Estrogen Receptor Status + Progesterone Receptor Status + Primary tumor HER2 status interpretation',
              value_map: {
                'HER2 status interpretation = Positive': 'HER2+',
                'HER2 status interpretation = Negative AND (ER = Positive OR PR = Positive)':
                  'HR+/HER2-',
                'HER2 status interpretation = Negative AND ER = Negative AND PR = Negative':
                  'TNBC',
                'Any component = Unknown': 'Unknown',
              },
            },
            'aurora-eu': {
              field: 'type (also mirrored in IHC_primary / IHC_meta)',
              value_map: {
                'HER2+': 'HER2+',
                'HR+/HER2-': 'HR+/HER2-',
                TNBC: 'TNBC',
                'N/A': 'Unknown',
              },
            },
          },
        },
        {
          name: 'HER2 Status',
          values: ['Positive', 'Negative', 'Unknown'],
          notes:
            'US collapses its own multiple HER2 assays (IHC, FISH, copy number) into "Primary tumor HER2 status interpretation," which is used as the canonical source rather than re-deriving from the raw IHC/FISH values. EU\'s type/IHC field is a 3-way subtype call rather than a direct HER2 readout, so HER2+ maps to Positive and both other categories map to Negative (a judgment call: TNBC and HR+/HER2- are both HER2-negative by definition of those labels).',
          sources: {
            'aurora-us': {
              field: 'Primary tumor HER2 status interpretation',
              value_map: { Positive: 'Positive', Negative: 'Negative', Unknown: 'Unknown' },
            },
            'aurora-eu': {
              field: 'type / IHC_primary / IHC_meta',
              value_map: {
                'HER2+': 'Positive',
                'HR+/HER2-': 'Negative',
                TNBC: 'Negative',
                'N/A': 'Unknown',
              },
            },
          },
        },
        {
          name: 'Hormone Receptor (HR) Status',
          values: ['Positive', 'Negative', 'Unknown', 'Indeterminate (HER2+)'],
          notes:
            'US reports ER and PR separately; HR is treated as Positive if either is Positive, Negative if both are Negative, else Unknown. EU\'s type field does not separate HR from HER2 for HER2+ tumors (a HER2+ tumor could be HR+ or HR- in reality), so HER2+ is mapped to "Indeterminate (HER2+)" rather than guessed as Positive or Negative — this is the single largest information-loss point in the crosswalk.',
          sources: {
            'aurora-us': {
              field: 'Estrogen Receptor Status + Progesterone Receptor Status',
              value_map: {
                'ER = Positive OR PR = Positive': 'Positive',
                'ER = Negative AND PR = Negative': 'Negative',
                'Either = Unknown': 'Unknown',
              },
            },
            'aurora-eu': {
              field: 'type',
              value_map: {
                'HR+/HER2-': 'Positive',
                TNBC: 'Negative',
                'HER2+': 'Indeterminate (HER2+)',
                'N/A': 'Unknown',
              },
            },
          },
        },
        {
          name: 'De Novo Metastatic Disease',
          values: ['Yes', 'No', 'Unknown'],
          notes:
            'EU reports this explicitly as a boolean. US has no dedicated field; the closest signal is the "Not applicable (Stage IV at presentation)" value nested inside its adjuvant-treatment question, which functionally means the patient was metastatic at diagnosis and adjuvant treatment for "localized disease" never applied.',
          sources: {
            'aurora-us': {
              field:
                'Did the patient receive adjuvant treatment for localized disease?',
              value_map: {
                'Not applicable (Stage IV at presentation)': 'Yes',
                Yes: 'No',
                No: 'No',
                NA: 'Unknown',
              },
            },
            'aurora-eu': {
              field: 'is_de_novo',
              value_map: { true: 'Yes', false: 'No' },
            },
          },
        },
        {
          name: 'Adjuvant Treatment for Localized Disease',
          values: ['Yes', 'No', 'Not Applicable (De Novo Metastatic)', 'Unknown'],
          notes:
            'EU\'s boolean cannot distinguish "No, but localized treatment was applicable" from "Not applicable, patient was de novo metastatic" the way the US field explicitly can; both false-equivalent EU cases are mapped to "No" unless is_de_novo is also true, in which case they should be read as Not Applicable (a cross-field judgment call left as a caveat rather than resolved automatically here).',
          sources: {
            'aurora-us': {
              field: 'Did the patient receive adjuvant treatment for localized disease?',
              value_map: {
                Yes: 'Yes',
                No: 'No',
                'Not applicable (Stage IV at presentation)':
                  'Not Applicable (De Novo Metastatic)',
                NA: 'Unknown',
              },
            },
            'aurora-eu': {
              field: 'adjuvant (cross-check against is_de_novo)',
              value_map: {
                true: 'Yes',
                'false, is_de_novo = false': 'No',
                'false, is_de_novo = true': 'Not Applicable (De Novo Metastatic)',
              },
            },
          },
        },
        {
          name: 'Neoadjuvant Treatment for Localized Disease',
          values: ['Yes', 'No', 'Unknown'],
          notes:
            'EU reports this directly. US has no equivalent field at all (it records tissue timing relative to neoadjuvant treatment for sample provenance, but never whether neoadjuvant treatment itself occurred), so every US record maps to Unknown for this facet.',
          sources: {
            'aurora-us': {
              field: 'No equivalent field',
              value_map: { '(all values)': 'Unknown' },
            },
            'aurora-eu': {
              field: 'neoadjuvant',
              value_map: { true: 'Yes', false: 'No' },
            },
          },
        },
        {
          name: 'Sample Type',
          values: ['Primary', 'Metastatic', 'Unknown'],
          notes:
            'US reports this directly at the sample level. EU does not have a single sample-type field, but its per-field naming convention (fields suffixed _primary vs _meta, e.g. PAM50_primary/PAM50_meta, IHC_primary/IHC_meta) and metastatic_biopsy_site effectively encode the same distinction at the record level.',
          sources: {
            'aurora-us': {
              field: 'Sample_Type',
              value_map: { Primary: 'Primary', Metastatic: 'Metastatic' },
            },
            'aurora-eu': {
              field:
                'Inferred from metastatic_biopsy_site being populated (non-N/A) vs. the _primary-suffixed fields being populated',
              value_map: {
                'metastatic_biopsy_site != N/A': 'Metastatic',
                'metastatic_biopsy_site = N/A': 'Primary',
              },
            },
          },
        },
        {
          name: 'Metastatic Biopsy Site (Anatomic)',
          values: [
            'Abdominal wall', 'Brain', 'Breast', 'Chest wall', 'Liver', 'Lung',
            'Lymph node', 'Other', 'Ovary', 'Pleura', 'Skin', 'Soft tissue', 'Unknown',
          ],
          notes:
            'EU-only granularity. US records whether a sample is Metastatic but never the anatomic biopsy site, so all US records map to Unknown for this facet; this is a one-directional facet, not a true crosswalk.',
          sources: {
            'aurora-us': {
              field: 'No equivalent field',
              value_map: { '(all values)': 'Unknown' },
            },
            'aurora-eu': {
              field: 'metastatic_biopsy_site',
              value_map: { 'N/A': 'Unknown', '(all other values)': 'pass-through' },
            },
          },
        },
        {
          name: 'Pathologic N Stage',
          values: ['N0', 'N1', 'N2', 'N3', 'NX', 'Unknown'],
          notes:
            'Directly comparable concept; the only judgment call is normalizing case/formatting (US prefixes with a lowercase "p", EU does not) and treating US "NA" and EU "N/A" both as Unknown rather than NX, since NA/N/A denotes missing data while NX denotes "not assessed" as a clinical finding.',
          sources: {
            'aurora-us': {
              field: 'Pathologic N',
              value_map: {
                pN0: 'N0', pN1: 'N1', pN2: 'N2', pN3: 'N3', pNx: 'NX',
                NA: 'Unknown', Unknown: 'Unknown',
              },
            },
            'aurora-eu': {
              field: 'primary_patho_node_status',
              value_map: {
                N0: 'N0', N1: 'N1', N2: 'N2', N3: 'N3', NX: 'NX',
                'N/A': 'Unknown', NA: 'Unknown',
              },
            },
          },
        },
        {
          name: 'Primary Tumor Size Category',
          values: ['T1/T2 (Smaller)', 'T3/T4 (Larger)', 'Unknown'],
          notes:
            'EU only records a coarse T1/T2 vs. larger split, so the US pT1-pT4 scale is deliberately collapsed to match EU\'s resolution rather than inventing false EU granularity. This loses information on the US side (pT1 vs pT2, pT3 vs pT4 are not distinguishable in this shared facet).',
          sources: {
            'aurora-us': {
              field: 'Pathologic T',
              value_map: {
                pT1: 'T1/T2 (Smaller)', pT2: 'T1/T2 (Smaller)',
                pT3: 'T3/T4 (Larger)', pT4: 'T3/T4 (Larger)',
                NA: 'Unknown', Unknown: 'Unknown',
              },
            },
            'aurora-eu': {
              field: 'primary_size_t1_or_t2',
              value_map: {
                TRUE: 'T1/T2 (Smaller)', FALSE: 'T3/T4 (Larger)', 'N/A': 'Unknown',
              },
            },
          },
        },
        {
          name: 'Histologic Grade',
          values: ['1', '2', '3', '4', 'Unknown'],
          notes: 'EU-only facet; US does not report tumor grade anywhere in its metadata, so all US records map to Unknown.',
          sources: {
            'aurora-us': { field: 'No equivalent field', value_map: { '(all values)': 'Unknown' } },
            'aurora-eu': {
              field: 'primary_grade',
              value_map: { '1': '1', '2': '2', '3': '3', '4': '4', 'N/A': 'Unknown', NA: 'Unknown' },
            },
          },
        },
        {
          name: 'Intrinsic Molecular Subtype (PAM50)',
          values: ['Basal', 'Her2', 'LumA', 'LumB', 'Normal', 'Unknown'],
          notes:
            'EU-only facet derived from gene-expression profiling; US has no PAM50 or equivalent intrinsic-subtype call, so all US records map to Unknown. Not to be confused with "Molecular Subtype (Clinical IHC)" above, which is antibody/assay-based rather than expression-based and is available (directly or derived) on both sides.',
          sources: {
            'aurora-us': { field: 'No equivalent field', value_map: { '(all values)': 'Unknown' } },
            'aurora-eu': {
              field: 'PAM50_primary / PAM50_meta',
              value_map: {
                Basal: 'Basal', Her2: 'Her2', LumA: 'LumA', LumB: 'LumB',
                Normal: 'Normal', 'N/A': 'Unknown',
              },
            },
          },
        },
        {
          name: 'Sex',
          values: ['Female', 'Unknown'],
          notes:
            'US reports this explicitly (all Female in this cohort). EU has no sex field, but the study is a breast cancer cohort recruited under the same clinical criteria as Aurora US, so Female is assumed rather than confirmed — flagged here as an assumption, not a verified value.',
          sources: {
            'aurora-us': { field: 'Sex', value_map: { Female: 'Female' } },
            'aurora-eu': {
              field: 'No equivalent field',
              value_map: { '(assumed for all records)': 'Female (assumed, unverified)' },
            },
          },
        },
      ],
      unmapped_fields: {
        notes:
          'Fields below have no reasonable counterpart in the other study and were left as source-only facets rather than forced into a shared field.',
        'aurora-us-only': [
          'Cancer Type', 'Cancer Type Detailed', 'Ethnicity', 'Race',
          'Family history of breast or ovarian cancer?', 'Disease Free Status',
          'Histologic Type', 'Source of tissue used for mutational profile',
          'Number Proliferating Cells', 'Oncotree Code', 'Overall Survival Status',
          'Participating site', 'Preservation', 'Does the patient have a second breast primary?',
          'Does the patient have a second breast primary?_1',
          'Is HER2 copy number known? (Primary tumor)', 'HER2 copy number for primary tumor',
          'Primary tumor HER2 FISH', 'Clinical M stage of first primary',
          'Clinical N stage of first primary', 'Did patient receive a genomic prognostic assay for this tumor?',
          'Source of genomic prognostic assay on first primary', 'Clinical Stage',
          'Clinical T stage of first primary', 'Did patient receive radiation for localized disease?',
          'Did patient receive radiation for metastatic disease?', 'Number of Samples Per Patient',
          'Type of primary tumor final resection', 'Pathologic M', 'Pathologic Stage',
        ],
        'aurora-eu-only': [
          'block_before_or_after_neo_treatment', 'patient_in_oncoplot',
        ],
      },
    },
  ]