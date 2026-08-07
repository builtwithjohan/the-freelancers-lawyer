/**
 * Scoring Module: Evaluates contract safety score based on flagged risk rules.
 */

// Scoring Model Parameters (DI-12)
export const BASELINE_CONTRACT_RISK = 10;
export const MAX_CONTRACT_SCORE = 99;
export const RULE_WEIGHT_MULTIPLIER = 0.7;
export const UNIQUE_RULE_COUNT_PENALTY = 6;

/**
 * Calculates overall Contract Screw Score (0 - 100) and hazard tier badge.
 */
export function calculateContractScore(flaggedClauses, totalSections) {
  if (!flaggedClauses || flaggedClauses.length === 0) {
    return {
      score: BASELINE_CONTRACT_RISK,
      badge: '🛡️ SAFE & FAIR',
      badgeColor: '#00e676',
      uniqueRulesCount: 0,
      cleanSectionsCount: totalSections
    };
  }

  // Deduplicate unique rule hits (DI-03)
  const uniqueRuleIds = new Set(flaggedClauses.map(c => c.ruleId));
  const uniqueRulesCount = uniqueRuleIds.size;

  // Maximum single hazard score dictates baseline
  const maxClauseScore = Math.max(...flaggedClauses.map(c => c.screwScore));
  const sumScores = flaggedClauses.reduce((acc, c) => acc + c.screwScore, 0);
  const avgScore = sumScores / flaggedClauses.length;

  // Weighted calculation: worst hazard + unique rule penalty
  let score = Math.min(
    MAX_CONTRACT_SCORE,
    Math.max(maxClauseScore, Math.round(avgScore * RULE_WEIGHT_MULTIPLIER + uniqueRulesCount * UNIQUE_RULE_COUNT_PENALTY))
  );

  // Determine hazard badge and color
  let badge = '🛡️ SAFE & FAIR';
  let badgeColor = '#00e676'; // Emerald Green

  if (score >= 85) {
    badge = '☣️ CRITICAL THREAT';
    badgeColor = '#ff3b5c'; // Neon Crimson
  } else if (score >= 65) {
    badge = '🚨 HIGH RISK CONTRACT';
    badgeColor = '#ff6b35'; // Vibrant Orange
  } else if (score >= 40) {
    badge = '⚠️ MODERATE RISK';
    badgeColor = '#ffb800'; // Amber Yellow
  }

  // Sections with zero flags (DI-03)
  const flaggedSectionTitles = new Set(flaggedClauses.map(c => c.sectionTitle));
  const cleanSectionsCount = Math.max(0, totalSections - flaggedSectionTitles.size);

  return {
    score,
    badge,
    badgeColor,
    uniqueRulesCount,
    cleanSectionsCount
  };
}
