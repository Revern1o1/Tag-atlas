# Tag-atlas

Character creator and semantic tag atlas.

## Taxonomy v2

Tag Atlas uses a 16-category semantic taxonomy as the curated interface over the source `tag_index.json` dataset.

The taxonomy is deliberately separate from the raw source data:

- `data/taxonomy-v2.json` — categories, domains, and selection rules.
- `data/tag-schema.json` — normalized representation for indexed tags.
- `data/tag-mapping.json` — initial mappings from known source tags into semantic families.
- `data/tag-index-source-manifest.json` — verified source profile and checksum.
- `scripts/validate-tag-index.mjs` — validates the raw source structure.
- `scripts/build-tag-index.mjs` — converts the raw source into normalized, searchable derived data.

### Categories

1. Subject & Identity
2. Hair
3. Eyes
4. Face
5. Head & Facial Accessories
6. Body & Anatomy
7. Appendages
8. Expression & Emotion
9. Upper Clothing
10. Lower Clothing
11. Outfits & Fashion
12. Accessories & Props
13. Pose & Action
14. Composition & Camera
15. Environment & Setting
16. Lighting & Rendering

### Source index

The uploaded source was validated as a five-group dataset containing **107,459 tag records**:

| Group | Records |
| --- | ---: |
| General | 26,275 |
| Meta | 282 |
| Series | 8,612 |
| Characters | 30,094 |
| Artists | 42,196 |

8,107 records contain aliases. Each source row is `[tag, frequency, aliases_csv]`.

The source checksum is recorded in `data/tag-index-source-manifest.json` so a future copy can be verified before ingestion.

### Ingestion

Place the source `tag_index.json` at the repository root, then run:

```bash
node scripts/validate-tag-index.mjs
node scripts/build-tag-index.mjs
```

The build produces:

- `data/generated/tags.normalized.json`
- `data/generated/tags.by-category.json`
- `data/generated/aliases.json`
- `data/generated/stats.json`

The raw source remains immutable; taxonomy classification is a derived layer.

### Design principle

The 16 categories are the curated prompt-building interface. The complete source index remains an advanced layer so specialized tags are not lost merely because they do not fit the curated taxonomy.

Tag families and selection rules are intended to replace a large hard-coded mutex list with reusable semantic constraints.
