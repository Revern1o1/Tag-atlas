import fs from 'node:fs';
import { classifyTag, classifySpecialSourceGroup } from './classify-tag.mjs';
import { getSourcePolicy } from './classify-source-groups.mjs';

const sourcePath = process.argv[2] || 'data/tags_index.json';
const outputPath = process.argv[3] || 'data/semantic-index.json';
const source = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
const result = { version: 1, source: 'tags_index.json', generatedAt: new Date().toISOString(), stats: {}, tags: {} };

for (const [group, entries] of Object.entries(source)) {
  const policy = getSourcePolicy(group);
  let classified = 0;
  for (const entry of entries) {
    if (!Array.isArray(entry) || typeof entry[0] !== 'string') continue;
    const [name, frequency, aliasCsv = ''] = entry;
    const aliases = aliasCsv ? aliasCsv.split(',').map(s => s.trim()).filter(Boolean) : [];
    const semantic = policy.category ? { ...classifySpecialSourceGroup(group), confidence: 1 } : classifyTag(name);
    result.tags[name] = {
      name,
      frequency,
      aliases,
      sourceGroup: group,
      status: semantic && semantic.confidence >= 0.9 ? 'curated-candidate' : 'advanced',
      ...(semantic || { category: null, domain: null, confidence: 0, method: 'unclassified' })
    };
    if (semantic) classified++;
  }
  result.stats[group] = { total: entries.length, classified, coverage: entries.length ? classified / entries.length : 0 };
}

fs.mkdirSync(new URL('.', `file://${process.cwd()}/${outputPath}`).pathname, { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
console.log(JSON.stringify(result.stats, null, 2));
