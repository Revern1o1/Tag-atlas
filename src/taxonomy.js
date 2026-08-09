import taxonomy from '../taxonomy.json' with { type: 'json' };

export const TAXONOMY = taxonomy;

export function getCategory(id) {
  return TAXONOMY.categories.find((category) => category.id === id) ?? null;
}

export function getDomain(categoryId, domainId) {
  const category = getCategory(categoryId);
  return category?.domains.find((domain) => domain === domainId) ?? null;
}

export function isSingleSelection(categoryId, domainId) {
  return TAXONOMY.selectionRules.single.includes(`${categoryId}.${domainId}`);
}

export function isMultiSelection(categoryId, domainId) {
  return TAXONOMY.selectionRules.multiple.includes(`${categoryId}.${domainId}`);
}

export function normalizeTag(tag) {
  return tag.trim().toLowerCase().replace(/\\s+/g, '_');
}

export function buildPrompt(tags) {
  return [...new Set(tags.map(normalizeTag).filter(Boolean))].join(', ');
}
