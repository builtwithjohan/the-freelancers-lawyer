/**
 * Contract Analyzer Core Facade for The Freelancer's Lawyer
 * Orchestrates sectionizing, rule matching, risk scoring, and counter-clause analysis.
 */

import { RISK_CATEGORIES, ANALYSIS_RULES } from './rules.js';
import { sectionizeContract } from './sectionizer.js';
import { calculateContractScore } from './scoring.js';
import { generateNegotiationEmail } from './negotiationEmail.js';
import { CANONICAL_LEGAL_DISCLAIMER } from './constants.js';

export { RISK_CATEGORIES, ANALYSIS_RULES, sectionizeContract, calculateContractScore, generateNegotiationEmail, CANONICAL_LEGAL_DISCLAIMER };

/**
 * Main analysis function that parses document lines and evaluates risk metrics.
 */
export function analyzeContract(contractText) {
  if (!contractText || typeof contractText !== 'string') {
    return {
      score: 0,
      badge: 'NO DATA',
      badgeColor: '#888',
      summary: 'No contract text provided for analysis.',
      flaggedClauses: [],
      categoriesCount: {},
      cleanSectionsCount: 0,
      totalSections: 0,
      foundRuleIds: [],
      disclaimer: CANONICAL_LEGAL_DISCLAIMER
    };
  }

  const sections = sectionizeContract(contractText);
  const flaggedClauses = [];
  const foundRuleIds = new Set(); // Populated and tracked for unique rule counts (DI-03)

  let cumulativeOffset = 0;

  // Test sections against rules
  sections.forEach((sec) => {
    const secStartIndex = contractText.indexOf(sec.text, cumulativeOffset);
    if (secStartIndex !== -1) {
      cumulativeOffset = secStartIndex + sec.text.length;
    }

    ANALYSIS_RULES.forEach(rule => {
      const match = rule.regex.exec(sec.text);
      if (match) {
        foundRuleIds.add(rule.id);

        const lineMatches = sec.text.split('\n').filter(l => rule.regex.test(l));
        const matchedSnippet = lineMatches[0] || sec.text.slice(0, 180) + '...';

        // Stable ID based on rule ID + section title slug (DI-01 - no positional secIdx)
        const titleSlug = (sec.title || 'preamble').toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const stableClauseKey = `${rule.id}::${titleSlug}`;

        // Compute exact character offset in document (DI-09)
        const matchOffsetInSection = sec.text.indexOf(matchedSnippet.trim());
        const docStartIndex = secStartIndex !== -1 && matchOffsetInSection !== -1
          ? secStartIndex + matchOffsetInSection
          : -1;

        flaggedClauses.push({
          id: stableClauseKey,
          ruleId: rule.id,
          sectionTitle: sec.title || 'Clause',
          category: rule.category,
          categoryInfo: RISK_CATEGORIES[rule.category.toUpperCase()] || { name: rule.category },
          title: rule.title,
          severity: rule.severity,
          screwScore: rule.screwScore,
          originalSnippet: matchedSnippet.trim(),
          fullSectionText: sec.text.trim(),
          plainEnglish: rule.plainEnglish,
          legalWarning: rule.legalWarning,
          fixRecommendation: rule.fixRecommendation,
          docStartIndex,
          docEndIndex: docStartIndex !== -1 ? docStartIndex + matchedSnippet.trim().length : -1,
          isFixed: false
        });
      }
    });
  });

  // Calculate score & metrics using scoring module (DI-03, DI-12)
  const scoreMetrics = calculateContractScore(flaggedClauses, sections.length);

  // Categories count
  const categoriesCount = {};
  flaggedClauses.forEach(c => {
    categoriesCount[c.category] = (categoriesCount[c.category] || 0) + 1;
  });

  return {
    score: scoreMetrics.score,
    badge: scoreMetrics.badge,
    badgeColor: scoreMetrics.badgeColor,
    totalFlagged: flaggedClauses.length,
    flaggedClauses,
    categoriesCount,
    totalSections: sections.length,
    cleanSectionsCount: scoreMetrics.cleanSectionsCount,
    foundRuleIds: Array.from(foundRuleIds),
    disclaimer: CANONICAL_LEGAL_DISCLAIMER
  };
}
