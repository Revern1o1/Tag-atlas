# Classification policy

Tag Atlas separates source identity groups from visual-semantic classification.

- `artists` → artist identity
- `characters` → character identity
- `series` → series identity
- `meta` → meta/advanced
- `general` → lexical semantic classifier

The classifier emits a bucket, confidence and method. A low-confidence or unclassified record must remain searchable in the advanced index; it must never be silently discarded.

The coverage report is an engineering diagnostic, not proof of semantic correctness. High-frequency low-confidence records should be reviewed first because they have the greatest impact on search and generation quality.
