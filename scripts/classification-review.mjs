import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const input = process.env.TAG_INDEX ?? path.join(root, 'tag_index.json');
const output = process.env.REVIEW_OUT ?? path.join(root, 'data', 'classification-review.json');

const raw = JSON.parse(fs.readFileSync(input, 'utf8'));
const groups = ['general', 'meta', 'series', 'characters', 'artists'];
const rows = [];

for (const group of groups) {
  const entries = Array.isArray(raw[group]) ? raw[group] : [];
  for (const entry of entries) {
    const [tag, frequency = 0, aliases = ''] = entry;
    const name = String(tag ?? '');
    const lower = name.toLowerCase();
    let bucket = 'unclassified';
    let confidence = 0;
    let method = 'source-group-fallback';

    if (group === 'artists') { bucket = 'artist-identity'; confidence = 1; }
    else if (group === 'characters') { bucket = 'character-identity'; confidence = 1; }
    else if (group === 'series') { bucket = 'series-identity'; confidence = 1; }
    else if (group === 'meta') { bucket = 'meta'; confidence = 1; }
    else {
      const rules = [
        [/hair|bangs|ponytail|braid|twintails/, 'hair', .95],
        [/eye|pupil|sclera/, 'eyes', .95],
        [/mouth|lip|teeth|tongue|makeup|freckles/, 'face', .9],
        [/ear|horn|glasses|eyepatch|hat|cap|headband|crown/, 'head', .9],
        [/wing|tail|tentacle|extra_arm|extra_leg/, 'appendages', .9],
        [/skin|muscular|slim|chest|breasts|torso|arm|hand|leg|foot/, 'body', .85],
        [/smile|grin|cry|crying|angry|sad|happy|surprised|blush|expression/, 'expression', .9],
        [/shirt|blouse|jacket|coat|sleeve|collar|hoodie|top/, 'upper-clothing', .9],
        [/skirt|pants|shorts|stockings|socks|pantyhose|leggings/, 'lower-clothing', .9],
        [/dress|uniform|kimono|yukata|gothic|maid|school/, 'outfits', .85],
        [/necklace|earrings|bracelet|bag|backpack|weapon|sword|gun|holding/, 'accessories-props', .85],
        [/pose|standing|sitting|kneeling|lying|walking|running|jumping|gesture|holding/, 'pose-action', .8],
        [/close-up|upper_body|full_body|cowboy_shot|from_behind|from_side|looking_at_viewer|perspective|camera/, 'composition', .95],
        [/indoors|outdoors|room|bedroom|street|forest|sky|night|day|rain|snow|summer|winter/, 'environment', .8],
        [/lighting|light|shadow|glow|lens_flare|depth_of_field|bokeh|monochrome/, 'lighting-rendering', .85]
      ];
      for (const [re, category, score] of rules) {
        if (re.test(lower)) { bucket = category; confidence = score; method = 'lexical-rule'; break; }
      }
    }
    rows.push({ tag: name, sourceGroup: group, frequency: Number(frequency) || 0, aliases: String(aliases || '').split(',').map(s => s.trim()).filter(Boolean), bucket, confidence, method });
  }
}

const counts = {};
for (const row of rows) counts[row.bucket] = (counts[row.bucket] ?? 0) + 1;
const lowConfidence = rows.filter(r => r.confidence < 0.7).sort((a, b) => b.frequency - a.frequency);
const unclassified = rows.filter(r => r.bucket === 'unclassified').sort((a, b) => b.frequency - a.frequency);

const report = {
  version: 1,
  generatedAt: new Date().toISOString(),
  totalRecords: rows.length,
  counts,
  coverage: rows.length ? 1 - unclassified.length / rows.length : 0,
  lowConfidenceCount: lowConfidence.length,
  unclassifiedCount: unclassified.length,
  topUnclassified: unclassified.slice(0, 500),
  topLowConfidence: lowConfidence.slice(0, 500)
};

fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ totalRecords: rows.length, coverage: report.coverage, unclassified: unclassified.length, lowConfidence: lowConfidence.length, output }, null, 2));
