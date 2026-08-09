import fs from 'node:fs';
import crypto from 'node:crypto';

const file = 'tag_index.json';
if (!fs.existsSync(file)) throw new Error(`Missing ${file}`);

const raw = fs.readFileSync(file);
const data = JSON.parse(raw.toString('utf8'));
const expectedGroups = ['general', 'meta', 'series', 'characters', 'artists'];

for (const group of expectedGroups) {
  if (!Array.isArray(data[group])) throw new Error(`Expected ${group} to be an array`);
  for (const row of data[group]) {
    if (!Array.isArray(row) || row.length !== 3) throw new Error(`Invalid row in ${group}`);
    if (typeof row[0] !== 'string') throw new Error(`Invalid tag name in ${group}`);
    if (!Number.isInteger(row[1])) throw new Error(`Invalid frequency for ${row[0]}`);
    if (typeof row[2] !== 'string') throw new Error(`Invalid aliases for ${row[0]}`);
  }
}

const total = expectedGroups.reduce((n, g) => n + data[g].length, 0);
const aliases = expectedGroups.reduce((n, g) => n + data[g].filter(row => row[2].trim()).length, 0);
const sha256 = crypto.createHash('sha256').update(raw).digest('hex');

console.log(JSON.stringify({ valid: true, total, aliases, groups: Object.fromEntries(expectedGroups.map(g => [g, data[g].length])), sha256 }, null, 2));
