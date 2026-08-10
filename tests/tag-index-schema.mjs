import fs from 'node:fs';

const candidates = ['tag_index.json', 'tags_index.json'];
const source = candidates.find((p) => fs.existsSync(p));
if (!source) {
  console.log('tag-index schema: source file not present in repository; validation deferred');
  process.exit(0);
}

const data = JSON.parse(fs.readFileSync(source, 'utf8'));
const groups = ['general', 'meta', 'series', 'characters', 'artists'];
let count = 0;

for (const group of groups) {
  if (!Array.isArray(data[group])) throw new Error(`Expected array: ${group}`);
  for (const row of data[group]) {
    if (!Array.isArray(row) || row.length < 2) throw new Error(`Invalid row in ${group}`);
    if (typeof row[0] !== 'string' || typeof row[1] !== 'number') {
      throw new Error(`Invalid tag/frequency in ${group}: ${JSON.stringify(row).slice(0, 120)}`);
    }
    if (row.length >= 3 && typeof row[2] !== 'string') throw new Error(`Invalid aliases in ${group}`);
    count++;
  }
}

console.log(`tag-index schema OK: ${count} records`);
