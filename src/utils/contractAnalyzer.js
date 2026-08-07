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
      disclaimer: CANONICAL_LEGAL_DISCLAIMER
    };
  }

  const sections = sectionizeContract(contractText);
  const flaggedClauses = [];
  const foundRuleIds = new Set();

  // Test sections against rules
  sections.forEach((sec, secIdx) => {
    ANALYSIS_RULES.forEach(rule => {
      if (rule.regex.test(sec.text)) {
        foundRuleIds.add(rule.id);

        const lineMatches = sec.text.split('\n').filter(l => rule.regex.test(l));
        const matchedSnippet = lineMatches[0] || sec.text.slice(0, 180) + '...';

        // Generate stable clause key (DI-01)
        const clauseKey = `${rule.id}::sec-${secIdx}`;

        flaggedClauses.push({
          id: clauseKey,
          ruleId: rule.id,
          sectionIndex: secIdx,
          sectionTitle: sec.title || `Clause #${secIdx + 1}`,
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
    disclaimer: CANONICAL_LEGAL_DISCLAIMER
  };
}
