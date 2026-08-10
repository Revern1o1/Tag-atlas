import fs from 'node:fs';

const taxonomy = JSON.parse(fs.readFileSync('data/taxonomy-v2.json', 'utf8'));
const categories = taxonomy.categories ?? [];

if (categories.length !== 16) throw new Error(`Expected 16 categories, found ${categories.length}`);

const ids = new Set();
for (const category of categories) {
  if (!category.id || !category.name) throw new Error('Category missing id/name');
  if (ids.has(category.id)) throw new Error(`Duplicate category: ${category.id}`);
  ids.add(category.id);
  if (!Array.isArray(category.domains) || category.domains.length === 0) {
    throw new Error(`Category has no domains: ${category.id}`);
  }
}

const domainIds = new Set();
for (const category of categories) {
  for (const domain of category.domains) {
    if (domainIds.has(`${category.id}.${domain}`)) throw new Error(`Duplicate domain: ${category.id}.${domain}`);
    domainIds.add(`${category.id}.${domain}`);
  }
}

console.log(`taxonomy integrity OK: ${categories.length} categories, ${domainIds.size} domains`);
