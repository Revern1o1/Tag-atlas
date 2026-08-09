export const SOURCE_GROUP_POLICY = {
  general: { mode: 'semantic-classification', curatedEligible: true },
  meta: { mode: 'advanced-only', curatedEligible: false },
  series: { mode: 'identity-index', category: 'subject', domain: 'character-identity', curatedEligible: false },
  characters: { mode: 'identity-index', category: 'subject', domain: 'character-identity', curatedEligible: false },
  artists: { mode: 'artist-index', category: 'subject', domain: 'character-identity', curatedEligible: false }
};

export function getSourcePolicy(group) {
  return SOURCE_GROUP_POLICY[group] ?? { mode: 'advanced-only', curatedEligible: false };
}
