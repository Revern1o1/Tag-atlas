# Tag-atlas

Character creator and semantic tag atlas.

## Taxonomy v2

Tag Atlas uses a 16-category semantic taxonomy as the curated interface over the source `tag_index.json` dataset.

The taxonomy is deliberately separate from the raw source data:

- `data/taxonomy-v2.json` — categories, domains, and selection rules.
- `data/tag-schema.json` — normalized representation for indexed tags.
- `data/tag-mapping.json` — initial mappings from known source tags into semantic families.

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

### Design principle

The 16 categories are the curated prompt-building interface. The full source index remains available as an advanced layer so specialized tags are not lost merely because they do not fit the curated taxonomy.

Tag families and selection rules are intended to replace a large hard-coded mutex list with reusable semantic constraints.
