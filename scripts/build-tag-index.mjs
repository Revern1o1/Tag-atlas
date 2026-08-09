import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const SOURCE = path.join(ROOT, 'tag_index.json');
const TAXONOMY = path.join(ROOT, 'data', 'taxonomy-v2.json');
const OUT_DIR = path.join(ROOT, 'data', 'generated');

const FAMILY_RULES = [
  ['subject.count', /^(solo|\d+girls?|\d+boys?|multiple_(girls|boys)|\d+others?|no_humans)$/],
  ['hair.color', /(?:^|_)(black|brown|blonde|blue|green|pink|purple|red|orange|yellow|white|grey|gray|silver|aqua|teal|cyan|multicolored)_hair$/],
  ['hair.length', /^(very_long|long|medium|short|very_short|bald)_hair$/],
  ['hair.hairstyle', /(?:ponytail|twintail|braid|bun|bob|pixie|hime_cut|odango|drill_hair|hair_bun|hair_up)$/],
  ['eyes.color', /(?:^|_)(blue|green|red|brown|purple|pink|yellow|orange|aqua|cyan|grey|gray|black|white|silver|gold)_eyes$/],
  ['eyes.effects', /(glowing_eyes|flaming_eyes|bloodshot_eyes|colored_sclera|no_eyes|spiral_eyes)$/],
  ['expression.positive', /^(smile|grin|happy|laughing|smirk|pout)$/],
  ['expression.negative', /^(sad|crying|angry|scared|tears|embarrassed)$/],
  ['head.eyewear', /(glasses|eyewear|eyepatch|monocle|sunglasses)$/],
  ['head.horns', /horns?$/],
  ['head.ears', /ears?$/],
  ['appendages.wings', /wings?$/],
  ['appendages.tails', /tails?$/],
  ['appendages.extra-limbs', /(extra_arms|multiple_arms|mechanical_arms|tentacles|extra_legs)$/],
  ['composition.shot', /^(full_body|upper_body|cowboy_shot|close-up|portrait|headshot)$/],
  ['composition.camera-angle', /^(from_behind|from_side|from_above|from_below|three_quarter_view)$/],
  ['composition.gaze', /(looking_at_viewer|facing_viewer|looking_back|looking_away|eye_contact)$/],
  ['environment.time', /^(day|night|morning|evening|sunset|sunrise)$/],
  ['environment.weather', /^(rain|snow|fog|overcast|storm|cloud)$/],
  ['environment.season', /^(spring|summer|autumn|fall|winter)(?:_season)?$/],
  ['environment.location', /^(indoors|outdoors|street|beach|forest|classroom|bedroom|bathroom|kitchen|office|cafe|cityscape|rooftop)$/],
  ['lighting-rendering.direction', /(backlighting|sidelighting|underlighting|rim_lighting|dappled_sunlight)$/],
  ['lighting-rendering.effects', /(lens_flare|depth_of_field|light_particles|motion_lines|glow|caustics)$/],
  ['lighting-rendering.rendering-visual-style', /^(monochrome|greyscale|sketch|lineart|outline|pixel_art|chibi)$/],
  ['pose-action.actions', /^(walking|running|jumping|dancing|eating|drinking|sleeping|fighting)$/],
  ['pose-action.hand-gestures', /(pointing|thumbs_up|peace_sign|v_sign|waving|beckoning)$/],
  ['accessories-props.weapons', /(sword|gun|rifle|bow|polearm|staff|knife|spear|lance|weapon)/],
  ['accessories-props.held-objects', /^holding_/],
  ['outfits.uniforms', /(school_uniform|sailor_uniform|military_uniform|gym_uniform)$/],
  ['outfits.traditional', /^(kimono|yukata|hakama|qipao|china_dress)$/],
  ['outfits.fashion-styles', /^(gothic|lolita|casual|formal|streetwear|cyber_fashion|y2k_fashion)$/],
  ['upper-clothing.tops', /(shirt|blouse|top|tank_top|turtleneck|tube_top)$/],
  ['upper-clothing.outerwear', /(jacket|coat|cape|cloak|cardigan|blazer|hoodie|sweater)$/],
  ['lower-clothing.skirts', /skirt$/],
  ['lower-clothing.pants', /(pants|jeans|trousers)$/],
  ['lower-clothing.shorts', /shorts$/],
  ['lower-clothing.legwear', /(socks|stockings|pantyhose|thighhigh|leggings)$/],
  ['body.skin', /(skin|tanned|tan|pale_skin|dark_skin|colored_skin)$/],
  ['body.body-details', /(tattoo|scar|mole|freckles|nails|fingernails|veins)$/],
  ['face.markings', /(face_mark|facial_mark|face_scar|mole_|freckles|face_tattoo)$/],
  ['face.makeup', /^(makeup|lipstick|eyeshadow|eyeliner|blush)$/],
  ['face.mouth', /(open_mouth|closed_mouth|parted_lips|tongue_out|lips)$/],
];

const CATEGORY_ALIASES = new Map([
  ['subject', 'subject'], ['hair', 'hair'], ['eyes', 'eyes'], ['face', 'face'], ['head', 'head'],
  ['body', 'body'], ['appendages', 'appendages'], ['expression', 'expression'],
  ['upper-clothing', 'upper-clothing'], ['lower-clothing', 'lower-clothing'], ['outfits', 'outfits'],
  ['accessories-props', 'accessories-props'], ['pose-action', 'pose-action'], ['composition', 'composition'],
  ['environment', 'environment'], ['lighting-rendering', 'lighting-rendering']
]);

function normalizeAliases(raw) {
  if (!raw) return [];
  return raw.split(',').map(s => s.trim()).filter(Boolean).filter((v, i, a) => a.indexOf(v) === i);
}

function classify(name) {
  for (const [domain, pattern] of FAMILY_RULES) {
    if (pattern.test(name)) {
      const [category, subdomain] = domain.split('.');
      if (CATEGORY_ALIASES.has(category)) return { category, domain: subdomain, confidence: 0.9, method: 'rule' };
    }
  }
  return { category: 'subject', domain: 'character-identity', confidence: 0.05, method: 'fallback' };
}

function familyFor(category, domain, name) {
  const key = `${category}.${domain}`;
  return key.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '') || name;
}

if (!fs.existsSync(SOURCE)) {
  console.error('Missing tag_index.json at repository root. Add the uploaded source file before running this build.');
  process.exit(1);
}

const source = JSON.parse(fs.readFileSync(SOURCE, 'utf8'));
const taxonomy = JSON.parse(fs.readFileSync(TAXONOMY, 'utf8'));
const records = [];
const byCategory = Object.fromEntries(taxonomy.categories.map(c => [c.id, []]));

for (const [sourceType, entries] of Object.entries(source)) {
  for (const row of entries) {
    if (!Array.isArray(row) || row.length < 2) continue;
    const [name, frequency, aliasString = ''] = row;
    const { category, domain, confidence, method } = classify(String(name));
    const aliases = normalizeAliases(aliasString);
    const record = {
      id: String(name),
      name: String(name),
      aliases,
      frequency: Number(frequency) || 0,
      source: sourceType,
      category,
      domain,
      family: familyFor(category, domain, String(name)),
      confidence,
      classificationMethod: method,
      status: confidence >= 0.8 ? 'curated-candidate' : 'advanced'
    };
    records.push(record);
    byCategory[category].push(record);
  }
}

records.sort((a, b) => b.frequency - a.frequency || a.name.localeCompare(b.name));
for (const tags of Object.values(byCategory)) tags.sort((a, b) => b.frequency - a.frequency || a.name.localeCompare(b.name));

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(path.join(OUT_DIR, 'tags.normalized.json'), JSON.stringify({ version: 1, source: 'tag_index.json', count: records.length, tags: records }, null, 2));
fs.writeFileSync(path.join(OUT_DIR, 'tags.by-category.json'), JSON.stringify({ version: 1, source: 'tag_index.json', categories: byCategory }, null, 2));

const aliases = {};
for (const tag of records) {
  for (const alias of tag.aliases) aliases[alias] = tag.id;
}
fs.writeFileSync(path.join(OUT_DIR, 'aliases.json'), JSON.stringify({ version: 1, aliases }, null, 2));

const stats = {
  generatedAt: new Date().toISOString(),
  sourceTypes: Object.fromEntries(Object.entries(source).map(([k, v]) => [k, v.length])),
  totalTags: records.length,
  aliases: Object.keys(aliases).length,
  categories: Object.fromEntries(Object.entries(byCategory).map(([k, v]) => [k, v.length])),
  classification: {
    rule: records.filter(t => t.classificationMethod === 'rule').length,
    fallback: records.filter(t => t.classificationMethod === 'fallback').length
  }
};
fs.writeFileSync(path.join(OUT_DIR, 'stats.json'), JSON.stringify(stats, null, 2));
console.log(JSON.stringify(stats, null, 2));
