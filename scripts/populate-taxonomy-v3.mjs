import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const input = process.env.TAG_INDEX ?? path.join(root, 'tag_index.json');
const taxonomy = JSON.parse(fs.readFileSync(path.join(root, 'data/taxonomy-schema-v3.json'), 'utf8'));
const families = JSON.parse(fs.readFileSync(path.join(root, 'data/tag-families-v1.json'), 'utf8'));
const raw = JSON.parse(fs.readFileSync(input, 'utf8'));

const categoryById = new Map(taxonomy.categories.map(c => [c.id, c]));
const domainIds = new Set(taxonomy.categories.flatMap(c => c.domains));
const familyValues = Object.values(families.families);

const aliasSplit = value => String(value ?? '').split(',').map(x => x.trim()).filter(Boolean);
const slug = value => String(value).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function semantic(tag, sourceGroup) {
  const t = tag.toLowerCase();
  if (sourceGroup === 'artists' || tag.startsWith('@')) return {category:'subject-identity',domain:'character-identity',attribute:'artist',family:null,status:'advanced',confidence:1,method:'source-group'};
  if (sourceGroup === 'characters') return {category:'subject-identity',domain:'character-identity',attribute:'character',family:null,status:'advanced',confidence:1,method:'source-group'};
  if (sourceGroup === 'series') return {category:'subject-identity',domain:'character-identity',attribute:'series',family:null,status:'advanced',confidence:1,method:'source-group'};
  if (sourceGroup === 'meta') return {category:null,domain:null,attribute:'meta',family:null,status:'advanced',confidence:1,method:'source-group'};

  const rules = [
    ['hair',[/\bhair\b|bangs|ponytail|twintail|braid|bun|bob|hime_cut|sidelock/,'hair']],[
      'eyes',[/eye|pupil|sclera/,'eyes']],
    ['face',[/mouth|lip|tooth|teeth|tongue|nose|freckles|mole|eyeliner|eyeshadow|lipstick|makeup/,'face']],
    ['head-facial-accessories',[/hat|helmet|headband|crown|glasses|sunglasses|eyepatch|monocle|mask|veil|halo|horn|antenna|ear/,'head-facial-accessories']],
    ['appendages',[/wing|tail|tentacle|extra_arm|extra_leg|claw|hoof|paws|scale|feather|fur/,'appendages']],
    ['body-anatomy',[/breast|chest|waist|hip|thigh|leg|knee|calf|foot|feet|toe|arm|hand|shoulder|stomach|navel|skin|tattoo|scar|bandage|muscular|petite|curvy/,'body-anatomy']],
    ['expression-emotion',[/smile|grin|smirk|laugh|cry|sad|angry|scared|surprised|blush|sweat|scream|ahegao/,'expression-emotion']],
    ['upper-clothing',[/shirt|blouse|t-shirt|tank_top|crop_top|tube_top|halter|sleeve|collar|jacket|coat|blazer|cardigan|sweater|hoodie|cape|cloak/,'upper-clothing']],
    ['lower-clothing',[/skirt|pants|jeans|shorts|leggings|stockings|pantyhose|socks|thighhigh|kneehigh/,'lower-clothing']],
    ['outfits-fashion',[/dress|uniform|kimono|yukata|hakama|hanfu|qipao|leotard|bodysuit|maid|idol|witch|armor|gothic|lolita|casual|formal|military/,'outfits-fashion']],
    ['accessories-props',[/necklace|earring|bracelet|ring|choker|brooch|bow|ribbon|hairclip|bag|backpack|pouch|phone|microphone|book|umbrella|sword|gun|bow|polearm|staff|knife|food|instrument|toy|furniture|tool/,'accessories-props']],
    ['pose-action',[/standing|sitting|kneeling|lying|crouching|arms_up|arm_raised|hands_on_hips|legs_apart|legs_crossed|knees_up|pointing|peace_sign|thumbs_up|waving|hugging|kissing|holding|walking|running|jumping|dancing|eating|drinking|sleeping|fighting|exercising/,'pose-action']],
    ['composition-camera',[/full_body|upper_body|cowboy_shot|portrait|close-up|extreme_close-up|from_behind|from_side|from_above|from_below|looking_at_viewer|looking_away|cropped|perspective|foreshortening|wide_angle|fisheye|dutch_angle|symmetrical|centered/,'composition-camera']],
    ['environment-setting',[/indoors|outdoors|bedroom|classroom|street|bathroom|kitchen|office|beach|forest|city|rooftop|castle|shrine|church|temple|sky|cloud|tree|flower|water|mountain|snow|night|morning|evening|sunset|sunrise|rain|fog|storm|spring|summer|autumn|winter|couch|bed|table|window|door|vehicle/,'environment-setting']],
    ['lighting-rendering',[/sunlight|moonlight|candlelight|window_light|backlighting|sidelighting|underlighting|rim_lighting|spotlight|shadow|depth_of_field|bokeh|lens_flare|light_rays|god_rays|glow|volumetric|monochrome|greyscale|silhouette|sketch|lineart|painterly|pixel_art|chibi/,'lighting-rendering']]
  ];
  for (const [category, [re, domainHint]] of rules) if (re.test(t)) {
    const categoryDef = categoryById.get(category);
    const domain = categoryDef.domains.includes(domainHint) ? domainHint : categoryDef.domains[0];
    const family = familyValues.find(f => f.category === category && f.domain === domain);
    return {category,domain,attribute:slug(tag),family:family ? Object.keys(families.families).find(k => families.families[k] === family) : null,status:'curated',confidence:0.75,method:'semantic-rule'};
  }
  return {category:null,domain:null,attribute:slug(tag),family:null,status:'advanced',confidence:0.1,method:'unclassified'};
}

const groups = ['general','meta','series','characters','artists'];
const records = [];
for (const sourceGroup of groups) {
  for (const entry of (Array.isArray(raw[sourceGroup]) ? raw[sourceGroup] : [])) {
    const [name, frequency=0, aliases=''] = entry;
    const semanticData = semantic(String(name), sourceGroup);
    records.push({id:slug(name),name:String(name),aliases:aliasSplit(aliases),sourceGroup,frequency:Number(frequency)||0,...semanticData,selection: semanticData.family && families.families[semanticData.family]?.selection || 'optional',related:[],compatible:[],conflicts:[]});
  }
}

const byCategory = {};
for (const record of records) {
  const key = record.category ?? 'advanced';
  (byCategory[key] ??= []).push(record);
}
for (const list of Object.values(byCategory)) list.sort((a,b)=>b.frequency-a.frequency);

const outputDir = path.join(root,'data','generated');
fs.mkdirSync(outputDir,{recursive:true});
fs.writeFileSync(path.join(outputDir,'tags.normalized.v3.json'),JSON.stringify({schemaVersion:'3.0.0',generatedAt:new Date().toISOString(),total:records.length,records},null,2)+'\n');
fs.writeFileSync(path.join(outputDir,'tags.by-category.v3.json'),JSON.stringify({schemaVersion:'3.0.0',total:records.length,byCategory},null,2)+'\n');

const summary = {schemaVersion:'3.0.0',total:records.length,curated:records.filter(r=>r.status==='curated').length,advanced:records.filter(r=>r.status==='advanced').length,classified:records.filter(r=>r.category).length,sourceGroups:Object.fromEntries(groups.map(g=>[g,records.filter(r=>r.sourceGroup===g).length])),families:Object.keys(families.families).length};
fs.writeFileSync(path.join(outputDir,'population-summary.json'),JSON.stringify(summary,null,2)+'\n');
console.log(JSON.stringify(summary,null,2));
