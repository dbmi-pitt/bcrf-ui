# Prompt:

I've attached a TSV (one row per record) and uniqueCombinedValues.json, which
lists the allowed values for each target column.

Goal: produce a TSV with these columns, in this order:
Source
Source Record ID
Patient ID
Molecular Subtype (Clinical IHC)
HER2 Status
Hormone Receptor (HR) Status
De Novo Metastatic Disease
Adjuvant Treatment for Localized Disease
Neoadjuvant Treatment for Localized Disease
Sample Type
Metastatic Biopsy Site (Anatomic)
Pathologic N Stage
Primary Tumor Size Category
Histologic Grade
Intrinsic Molecular Subtype (PAM50)
Sex

This is clinical breast cancer data, so apply clinical and biomedical domain knowledge when interpreting and mapping it.

Process all rows with code rather than writing them by hand, since the file is
large and every row needs to be mapped by the same rules.

For each target column, use your best clinical and biomedical data judgment to map from whichever source
columns are relevant. That includes deriving values from combinations of
columns (e.g., subtype from ER/PR/HER2) and using close equivalents when the
exact field isn't available (e.g., clinical N stage when pathologic isn't in
the file). Use only values from the JSON. If a source value is meaningful but none of the
existing values fit, add a new value and flag it in your notes. If the source
value is missing, uninformative, or has no reasonable mapping, use "Unknown".

Fixed rules:

- Source = [SOURCE_ID] for all rows.
- Source Record ID = [UNIQUE_ID_FOR_EACH_ROW]
- Patient ID = [PATIENT_ID]

Verify that the output has one row per input row and that
Source Record ID is unique.

When you're done, give me the downloadable TSV file plus a short note on the
mapping decisions and assumptions for each column (especially ambiguous ones),
and a value-count summary per column.

## Example

I've attached a TSV (one row per record) and uniqueCombinedValues.json, which
lists the allowed values for each target column.

Goal: produce a TSV with these columns, in this order:
Source
Source Record ID
Patient ID
Molecular Subtype (Clinical IHC)
HER2 Status
Hormone Receptor (HR) Status
De Novo Metastatic Disease
Adjuvant Treatment for Localized Disease
Neoadjuvant Treatment for Localized Disease
Sample Type
Metastatic Biopsy Site (Anatomic)
Pathologic N Stage
Primary Tumor Size Category
Histologic Grade
Intrinsic Molecular Subtype (PAM50)
Sex

This is clinical breast cancer data, so apply clinical and biomedical domain knowledge when interpreting and mapping it.

Process all rows with code rather than writing them by hand, since the file is
large and every row needs to be mapped by the same rules.

For each target column, use your best clinical and biomedical data judgment to map from whichever source
columns are relevant. That includes deriving values from combinations of
columns (e.g., subtype from ER/PR/HER2) and using close equivalents when the
exact field isn't available (e.g., clinical N stage when pathologic isn't in
the file). Use only values from the JSON. If a source value is meaningful but none of the
existing values fit, add a new value and flag it in your notes. If the source
value is missing, uninformative, or has no reasonable mapping, use "Unknown".

Fixed rules:

- Source = "upmc-ehr-bc-data-mart" for all rows.
- Source Record ID = column PATIENT_STUDY_ID + "-" + a per-patient counter on every row (-1, -2, ...).
- Patient ID = column PATIENT_STUDY_ID unchanged.

Verify that the output has one row per input row and that
Source Record ID is unique.

When you're done, give me the downloadable TSV file plus a short note on the
mapping decisions and assumptions for each column (especially ambiguous ones),
and a value-count summary per column.
