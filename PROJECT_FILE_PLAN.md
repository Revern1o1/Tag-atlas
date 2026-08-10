# Tag Atlas — Project File Plan

> **Purpose:** Persistent project context for human and AI contributors.
>
> This file is the project's working map. Read it before making substantial changes. Update it when architecture, priorities, file responsibilities, or implementation status changes.

## 1. What is Tag Atlas?

Tag Atlas is a semantic character/tag construction system built on a large Danbooru-style tag index.

The goal is **not** simply to display or search tags. The goal is to transform a very large raw tag vocabulary into a usable, structured character-generation system.

The core design is:

```text
Raw tag index
    ↓
Normalized tag records
    ↓
Semantic taxonomy
Category → Domain → Attribute / Tag
    ↓
Tag families + aliases + frequency + relationships + rules
    ↓
Curated mode                Advanced mode
16 categories               Full source index
high-value tags              all searchable tags
    ↓                           ↓
          Character Builder / Prompt Generator
```

## 2. Canonical design principles

1. Keep the **16 major categories** as the stable top-level interface.
2. Expand them into a scalable **Category → Domain → Attribute/Tag** hierarchy.
3. Do **not** force every source tag into a curated category.
4. Preserve the complete source index in an Advanced / Everything layer.
5. Preserve canonical names, aliases and frequencies from the source.
6. Use reusable **tag families** instead of giant hard-coded mutex lists.
7. Every attribute group may declare a selection rule: `single`, `multiple`, `optional`, `exclusive`, or `compatible`.
8. Separate physical/anatomical states from emotion when the concepts differ.
9. Keep source data immutable; derived indexes should be reproducible.
10. Never silently discard an unknown or low-confidence tag.
11. High-frequency ambiguous tags should be reviewed before low-frequency tags.
12. Do not claim a feature is implemented until it is verified in the repository and, where applicable, tested.

## 3. Canonical 16-category taxonomy

### 01 — Subject & Identity
- Count
- Gender / Focus
- Character Identity
- Species / Type
- Relationships
- Cosplay / alternate identity

### 02 — Hair
- Length
- Color
- Structure
- Hairstyle
- Bangs / Front
- Details / Color Modifiers
- Condition / Motion

### 03 — Eyes
- Color
- State
- Shape
- Pupils
- Effects

### 04 — Face
- Structure
- Mouth
- Teeth / Tongue
- Facial Markings
- Makeup
- Face Effects

### 05 — Head & Facial Accessories
- Ears
- Horns
- Headwear
- Eyewear / Face Accessories
- Supernatural Head Features

### 06 — Body & Anatomy
- Build
- Chest
- Torso
- Arms / Hands
- Legs / Feet
- Skin
- Body Details / Markings

### 07 — Appendages & Non-Human Anatomy
- Wings
- Tails
- Extra Limbs
- Creature Anatomy

### 08 — Expression & Emotion
- Positive
- Neutral
- Negative
- Reactive
- Intense / Exaggerated
- Emotional Modifiers

### 09 — Upper Clothing
- Tops
- Sleeves
- Collars / Necklines
- Outerwear
- Clothing State

### 10 — Lower Clothing
- Skirts
- Pants
- Shorts
- Legwear
- Legwear Properties

### 11 — Outfits & Fashion
- Dresses / One-piece
- Uniforms
- Traditional
- Fantasy / Roles
- Fashion Styles / Aesthetics

### 12 — Accessories & Props
- Jewelry
- Hair Accessories
- Bags
- Hand Accessories
- Held Objects
- Weapons
- Miscellaneous Props

### 13 — Pose & Action
- Stance
- Body Position
- Hand Gestures
- Character Interaction
- Actions
- Object Interaction

### 14 — Composition & Camera
- Shot
- Camera Angle
- Gaze / Orientation
- Crop
- Perspective
- Composition

### 15 — Environment & Setting
- Location
- Architecture
- Nature
- Time
- Weather
- Season
- Environmental Objects

### 16 — Lighting, Rendering & Visual Effects
- Light Source
- Direction
- Quality
- Effects
- Rendering / Visual Style

## 4. Source data contract

The raw `tags_index.json` / `tag_index.json` source is treated as external source data, not hand-edited application data.

Known source groups:

- `general`
- `meta`
- `series`
- `characters`
- `artists`

Known source record shape:

```text
[tag, frequency, aliases_csv]
```

The current source available during project planning contains approximately **107k records** and includes aliases and frequency information.

Never assume the exact filename or schema without validating the current source file.

## 5. Target normalized tag model

Every normalized tag should be capable of representing:

```json
{
  "id": "stable internal identifier",
  "name": "canonical tag",
  "aliases": [],
  "sourceGroup": "general",
  "frequency": 0,
  "category": "hair",
  "domain": "color",
  "attribute": "color",
  "family": "hair-color",
  "status": "curated|advanced|excluded",
  "confidence": 0,
  "classificationMethod": "...",
  "selection": "single|multiple|optional|exclusive|compatible",
  "related": [],
  "compatible": [],
  "conflicts": []
}
```

Fields may evolve, but raw source information must not be lost.

## 6. Tag-family strategy

Use families to represent reusable semantic groups.

Example:

```text
Hair Color
├── black_hair
├── brown_hair
├── blonde_hair
├── white_hair
├── blue_hair
└── ...

Hair Color Modifier
├── gradient_hair
├── streaked_hair
├── two-tone_hair
└── patterned_hair
```

Families should drive selection rules, conflicts and related-tag behavior where appropriate.

## 7. Selection-rule strategy

Do not maintain a huge manually coded mutex list.

Examples:

```text
Hair Color       → single
Hair Details     → multiple
Eye Color        → single
Eye Effects      → multiple
Skirt Length     → single
Clothing         → multiple
Lighting Effects → multiple
```

The taxonomy should declare rules wherever practical.

## 8. Curated vs Advanced

### Curated mode

The primary user-facing experience.

- 16 categories
- Expanded domains
- High-value / high-confidence tags
- Simple selection behavior
- Prompt-building focused

### Advanced / Everything mode

The complete source vocabulary.

- All searchable source tags
- Aliases
- Frequencies
- Character tags
- Series/franchise tags
- Artist tags
- Specialized tags
- Low-confidence/unclassified tags

A tag must not disappear simply because it cannot yet be confidently classified.

## 9. Repository map

| Path | Responsibility |
|---|---|
| `PROJECT_FILE_PLAN.md` | Persistent project specification and AI handoff context |
| `README.md` | Public project overview and setup documentation |
| `taxonomy.json` | Existing/legacy taxonomy data; inspect before replacing |
| `src/taxonomy.js` | Taxonomy-related application logic |
| `data/taxonomy-v2.json` | Expanded 16-category taxonomy definition |
| `data/tag-schema.json` | Normalized tag schema |
| `data/tag-mapping.json` | Initial semantic mappings; should evolve into systematic classification rules |
| `data/tag-index-source-manifest.json` | Source structure/count/checksum metadata |
| `data/classification-review.json` | Generated classification quality report when available |
| `scripts/validate-tag-index.mjs` | Source data validation |
| `scripts/build-tag-index.mjs` | Raw source → normalized/indexed data pipeline |
| `scripts/build-semantic-index.mjs` | Semantic index generation |
| `scripts/classify-source-groups.mjs` | Source-group classification |
| `scripts/classify-tag.mjs` | Individual tag classification logic |
| `scripts/classification-review.mjs` | Coverage/confidence review generation |
| `scripts/check-classification.mjs` | Classification quality gate |
| `index.html` | Current UI entry point; replace/refactor only after inspecting existing behavior |
| `vercel.json` | Vercel deployment configuration |

Generated large indexes should not be committed blindly. Decide storage/build strategy based on actual bundle size and performance tests.

## 10. Implementation phases

### Phase 1 — Repository audit
- [x] Identify repository and baseline.
- [x] Compare main with development branch.
- [x] Verify actual files rather than relying on conversation claims.
- [ ] Finish automated repository/build/test verification.

### Phase 2 — Source ingestion
- [ ] Validate exact source filename and schema.
- [ ] Make ingestion reproducible.
- [ ] Normalize all records.
- [ ] Preserve aliases and frequency.
- [ ] Produce source statistics.
- [ ] Define storage strategy for the large derived index.

### Phase 3 — Semantic taxonomy
- [ ] Finalize all domains under the 16 categories.
- [ ] Build systematic classification rules.
- [ ] Introduce confidence scoring.
- [ ] Generate review queues for ambiguous tags.
- [ ] Improve high-frequency classification first.
- [ ] Build tag families.
- [ ] Build selection/mutex rules.
- [ ] Add relationship/compatibility model.

### Phase 4 — Search/index
- [ ] Canonical tag search.
- [ ] Alias search.
- [ ] Fuzzy search.
- [ ] Frequency ranking.
- [ ] Category/domain/family filters.
- [ ] Character/series/artist search.
- [ ] Advanced full-index search.
- [ ] Performance test at full index scale.

### Phase 5 — Character builder
- [ ] Manual tag selection.
- [ ] Category generation.
- [ ] Domain generation.
- [ ] Full random generation.
- [ ] Weighted random generation.
- [ ] Lock selections.
- [ ] Remove selections.
- [ ] Duplicate prevention.
- [ ] Conflict resolution.
- [ ] Prompt ordering.
- [ ] Positive/negative prompt support.

### Phase 6 — UI/UX
- [ ] Category navigation.
- [ ] Domain navigation.
- [ ] Search.
- [ ] Filters.
- [ ] Selected-tag panel.
- [ ] Prompt preview.
- [ ] Copy/reset.
- [ ] Randomization controls.
- [ ] Lock controls.
- [ ] Responsive/mobile layout.
- [ ] Accessibility.
- [ ] Loading/error/empty states.

### Phase 7 — Verification & deployment
- [ ] Unit tests.
- [ ] Data validation tests.
- [ ] Taxonomy integrity tests.
- [ ] Classification quality gates.
- [ ] Production build.
- [ ] Browser verification.
- [ ] Mobile verification.
- [ ] Vercel preview deployment.
- [ ] Production deployment.
- [ ] Runtime verification.
- [ ] Merge development branch into main only after verification.

## 11. Current known gaps

These are intentionally tracked instead of being hidden by the existence of prototype code:

- The classifier must not rely on simplistic lexical fallback for final semantic quality.
- The UI must eventually consume the real normalized/search index rather than displaying domain names as stand-in tags.
- Compatibility and related-tag graphs are not complete.
- Full-index search is not complete.
- Character generation is not complete.
- Automated test coverage is incomplete.
- Production deployment is not yet considered verified.

## 12. Rules for future AI contributors

Before changing code:

1. Read this file.
2. Inspect the current branch and relevant files.
3. Do not assume a feature exists because this document says it is planned.
4. Verify implementation in the repository.
5. Preserve source data and existing behavior unless intentionally migrating it.
6. Prefer reusable data-driven rules over hard-coded tag lists.
7. Do not silently delete or discard unknown tags.
8. Update this file when architecture or phase status changes materially.
9. Run relevant validation/tests before declaring work complete.
10. Report what was actually changed and verified.

## 13. Definition of done

A feature is **implemented** only when:

- the code/data exists in the repository;
- the intended behavior is documented;
- relevant validation/tests pass;
- integration with the actual source data has been checked where applicable;
- performance implications have been considered for large-index features;
- deployment behavior has been verified for production-facing features.

Do not use "implemented" to mean "designed" or "started".

## 14. Change log

- **2026-08-10:** Created persistent project plan to preserve product purpose, taxonomy architecture, implementation phases, repository map, and AI contribution rules.
