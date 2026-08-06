/**
 * Contract Analyzer Tool for The Freelancer's Lawyer
 * Scans document text for high-risk legal traps, scores contract safety,
 * provides plain-English "How it screws you" breakdowns, and generates counter-proposals.
 */

export const RISK_CATEGORIES = {
  PAYMENT: { id: 'payment', name: 'Payment & Compensation', icon: 'DollarSign' },
  IP: { id: 'ip', name: 'IP & Work Ownership', icon: 'Lock' },
  REVISIONS: { id: 'revisions', name: 'Scope & Revisions', icon: 'RefreshCw' },
  LIABILITY: { id: 'liability', name: 'Liability & Indemnity', icon: 'ShieldAlert' },
  TERMINATION: { id: 'termination', name: 'Termination & Cancellation', icon: 'XCircle' },
  NON_COMPETE: { id: 'non_compete', name: 'Non-Compete & Exclusivity', icon: 'Slash' },
  JURISDICTION: { id: 'jurisdiction', name: 'Jurisdiction & Legal Costs', icon: 'Gavel' },
};

// Known high-threat legal patterns
const ANALYSIS_RULES = [
  {
    id: 'rule-net90-payment',
    category: 'payment',
    title: 'Excessive Payment Window (Net-60/90+)',
    severity: 'HIGH',
    screwScore: 88,
    regex: /(within\s*(ninety|sixty|90|60|\(\s*90\s*\)|\(\s*60\s*\))\s*\(?\d*\)?\s*days|net\s*(90|60)|60\s+days|90\s+days)/i,
    plainEnglish: 'The client wants up to 2-3 months AFTER work completion before paying your invoice. You act as an interest-free bank financing their cashflow while taking all the risk.',
    legalWarning: 'Extended payment terms put freelancers in severe financial distress and increase default risk.',
    fixRecommendation: 'Change payment terms to Net-15 or Net-30 maximum, with a 50% upfront deposit before work commences and 1.5% monthly late fee interest.'
  },
  {
    id: 'rule-withhold-payment',
    category: 'payment',
    title: 'Unilateral Right to Withhold Pay',
    severity: 'CRITICAL',
    screwScore: 95,
    regex: /(right to withhold payment|sole discretion|subjective satisfaction|does not meet quality|refuse to pay)/i,
    plainEnglish: 'The client gets to decide by themselves if they like your work. If they subjectively claim it "does not meet standards", they can legally keep your work AND refuse to pay you a single cent.',
    legalWarning: 'Subjective satisfaction clauses render the contract illusory and weaponize payment withholding.',
    fixRecommendation: 'Replace subjective approval with objective acceptance criteria specified in the Statement of Work, requiring written rejection within 5 business days detailing specific technical deficiencies.'
  },
  {
    id: 'rule-ip-before-payment',
    category: 'ip',
    title: 'IP Assignment Prior to Full Payment',
    severity: 'CRITICAL',
    screwScore: 98,
    regex: /(regardless of whether payment|immediately upon creation|prior to the term|prior to execution|transfers and conveys.*regardless)/i,
    plainEnglish: 'The client owns all your code, designs, and deliverables the exact millisecond you make them—EVEN IF THEY NEVER PAY YOU! If they default, you cannot stop them from using your work.',
    legalWarning: 'IP rights must remain with the freelancer until invoice payment has cleared in full.',
    fixRecommendation: 'Specify explicitly that all copyright and intellectual property rights transfer to Client ONLY upon Contractor’s receipt of FULL final payment.'
  },
  {
    id: 'rule-preexisting-code-grab',
    category: 'ip',
    title: 'Seizure of Pre-Existing Code & Personal Tools',
    severity: 'CRITICAL',
    screwScore: 94,
    regex: /(pre-existing|personal libraries|boilerplates|background code).*(become|property of client|exclusive property|forfeits|shall belong|transfers to client)/i,
    plainEnglish: 'The client is claiming ownership of your background libraries, starter templates, custom scripts, and reusable tools. If you sign this, you can never legally use your own dev tools or code templates again for another client!',
    legalWarning: 'Sweeping IP clauses often capture developer pre-existing trade secrets and proprietary tooling.',
    fixRecommendation: 'Exclude Contractor’s Pre-Existing Works, open-source libraries, and reusable framework components. Grant Client a non-exclusive license to use them solely within the deliverable.'
  },
  {
    id: 'rule-moral-rights-waiver',
    category: 'ip',
    title: 'Moral Rights & Attribution Waiver',
    severity: 'MEDIUM',
    screwScore: 70,
    regex: /(moral rights|attribution rights|retains zero ownership|portfolio waiver|forfeits all rights to reuse)/i,
    plainEnglish: 'You waive your right to showcase this project in your portfolio, claim credit for your own work, or mention that you built it.',
    legalWarning: 'Prevents freelancers from building portfolio credibility and proving work history.',
    fixRecommendation: 'Reserve Contractor’s right to display non-confidential project visuals and case studies in Contractor’s portfolio and marketing materials.'
  },
  {
    id: 'rule-unlimited-revisions',
    category: 'revisions',
    title: 'Unlimited Revisions & Scope Creep',
    severity: 'HIGH',
    screwScore: 88,
    regex: /(unlimited revisions|without additional compensation|total satisfaction|absolute satisfaction)/i,
    plainEnglish: 'The client can demand endless rewrites, redesigns, and new features forever for $0 extra. Your hourly rate will drop to pennies as project scope explodes.',
    legalWarning: 'Fixed price contracts with unlimited edits result in severe uncompensated scope creep.',
    fixRecommendation: 'Limit included revisions to two (2) rounds of minor adjustments within original scope. Additional revisions billed at standard hourly rate ($125/hr).'
  },
  {
    id: 'rule-daily-delay-fines',
    category: 'revisions',
    title: 'Daily Liquidated Damages / Delay Fines',
    severity: 'CRITICAL',
    screwScore: 96,
    regex: /(liquidated damages|\$\d+ per (calendar )?day|delay penalties|time is of the essence)/i,
    plainEnglish: 'If a deadline slips (even because the client took 3 weeks to respond to your email!), you get fined hundreds of dollars per day, deducted straight out of your pay.',
    legalWarning: 'Liquidated damages penalize freelancers unfairly for client-side delays and feedback bottlenecks.',
    fixRecommendation: 'Delete liquidated damages penalties. State that deadlines automatically extend by the number of business days Client delays in providing feedback or required assets.'
  },
  {
    id: 'rule-termination-no-pay',
    category: 'termination',
    title: 'Immediate Termination Without Pay',
    severity: 'CRITICAL',
    screwScore: 94,
    regex: /(no obligation to compensate|at any time for any reason|immediate notice|without paying|termination for convenience without compensation)/i,
    plainEnglish: 'The client can fire you on day 89 of a 90-day project, demand all your source files, and legally pay you $0 for all the work you already completed.',
    legalWarning: 'Unilateral termination without prorated compensation constitutes uncompensated work forfeiture.',
    fixRecommendation: 'Require fourteen (14) days written notice for termination. Client must compensate Contractor for all work performed up to termination date, plus a 25% early termination fee.'
  },
  {
    id: 'rule-broad-noncompete',
    category: 'non_compete',
    title: 'Excessive Non-Compete & Lockout',
    severity: 'HIGH',
    screwScore: 90,
    regex: /(non-compete|same industry|business sector|period of (two|three|2|3) years|any client, vendor, or contact)/i,
    plainEnglish: 'Bans you from working for any other client in your niche/industry for 2-3 years worldwide! This can destroy your career and livelihood.',
    legalWarning: 'Broad non-compete covenants restrict freelancer trade rights and industry mobility.',
    fixRecommendation: 'Remove non-compete entirely. Replace with standard Non-Disclosure (NDA) protecting Client’s confidential business secrets.'
  },
  {
    id: 'rule-uncapped-liability',
    category: 'liability',
    title: 'Uncapped Liability & Full Freelancer Indemnity',
    severity: 'CRITICAL',
    screwScore: 99,
    regex: /(uncapped financial liability|indemnify, defend, and hold harmless|without limitation|waiver of liability caps|all claims, damages, liabilities)/i,
    plainEnglish: 'If the client gets sued by anyone for anything remotely related to the project, YOU have to pay their expensive lawyers and all damages out of your personal bank account or savings!',
    legalWarning: 'Exposes individual freelancer personal assets to catastrophic lawsuit liabilities.',
    fixRecommendation: 'Cap total cumulative liability for both parties to the total amount of fees paid under the contract, excluding third-party IP infringement caused by Client assets.'
  },
  {
    id: 'rule-audit-rights',
    category: 'liability',
    title: 'Personal Computer & Financial Audit Rights',
    severity: 'HIGH',
    screwScore: 85,
    regex: /(audit (contractor|designer|vendor)\'s|file systems|accounting ledgers|personal computer)/i,
    plainEnglish: 'The client demands permission to inspect your private hard drives, financial accounts, and personal records on 24 hours notice.',
    legalWarning: 'Severe violation of personal privacy and third-party NDA obligations.',
    fixRecommendation: 'Delete personal computer audit clauses completely. Limit verification to standard invoice time tracking logs.'
  },
  {
    id: 'rule-remote-jurisdiction',
    category: 'jurisdiction',
    title: 'Remote Out-of-State Court & Attorney Fees',
    severity: 'MEDIUM',
    screwScore: 72,
    regex: /(delaware|wilmington|reimburse client for all legal fees|exclusive jurisdiction|foreign courts)/i,
    plainEnglish: 'If a payment dispute happens, you have to fly across the country to hire an expensive out-of-state trial lawyer in Delaware, making suing for your money financially impossible.',
    legalWarning: 'Inconvenient forum clauses force small freelancers to abandon legitimate payment claims.',
    fixRecommendation: 'Set jurisdiction to Contractor’s home state/city, or require mutual binding online arbitration (AAA/JAMS) with each party bearing their own legal costs.'
  }
];

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
      cleanSectionsCount: 0
    };
  }

  const lines = contractText.split('\n');
  const sections = [];
  let currentSection = { title: 'Preamble', text: '' };

  lines.forEach(line => {
    const trimmed = line.trim();
    if (trimmed.match(/^(\d+[\.\)]|[A-Z\s]{4,}:?|SECTION\s+[A-Z0-9]+|ARTICLE\s+[A-Z0-9]+|CLAUSE\s+\d+)/) && trimmed.length < 80) {
      if (currentSection.text.trim()) {
        sections.push(currentSection);
      }
      currentSection = { title: trimmed, text: trimmed + '\n' };
    } else {
      currentSection.text += line + '\n';
    }
  });
  if (currentSection.text.trim()) sections.push(currentSection);

  const flaggedClauses = [];
  const foundRuleIds = new Set();

  // Test sections against rules
  sections.forEach((sec, secIdx) => {
    ANALYSIS_RULES.forEach(rule => {
      if (rule.regex.test(sec.text)) {
        foundRuleIds.add(rule.id);
        
        const lineMatches = sec.text.split('\n').filter(l => rule.regex.test(l));
        const matchedSnippet = lineMatches[0] || sec.text.slice(0, 180) + '...';

        flaggedClauses.push({
          id: `${rule.id}-${secIdx}`,
          ruleId: rule.id,
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

  // Calculate total Contract Screw Score accurately
  let score = 10;
  if (flaggedClauses.length > 0) {
    const maxClauseScore = Math.max(...flaggedClauses.map(c => c.screwScore));
    const sumScores = flaggedClauses.reduce((acc, c) => acc + c.screwScore, 0);
    const avgScore = sumScores / flaggedClauses.length;

    // Weight formula: highest hazard clause dictates baseline risk + volume penalty
    score = Math.min(99, Math.max(maxClauseScore, Math.round(avgScore * 0.7 + flaggedClauses.length * 6)));
  }

  // Determine hazard badge
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

  // Categories count
  const categoriesCount = {};
  flaggedClauses.forEach(c => {
    categoriesCount[c.category] = (categoriesCount[c.category] || 0) + 1;
  });

  return {
    score,
    badge,
    badgeColor,
    totalFlagged: flaggedClauses.length,
    flaggedClauses,
    categoriesCount,
    totalSections: sections.length,
    cleanSectionsCount: Math.max(0, sections.length - flaggedClauses.length)
  };
}

/**
 * Generate a ready-to-send Client Counter-Proposal Email draft based on selected redlines.
 */
export function generateNegotiationEmail({ clientName = 'Client', freelancerName = 'Freelancer', selectedClauses = [], tone = 'firm' }) {
  if (selectedClauses.length === 0) {
    return `Hi ${clientName},\n\nThanks for sending over the contract! I've reviewed the terms and overall everything looks good. Let's move forward.\n\nBest regards,\n${freelancerName}`;
  }

  let intro = '';
  if (tone === 'polite') {
    intro = `Hi ${clientName},\n\nThank you for sharing the agreement! I'm really excited about working together on this project. Before we get started, I went through the contract and noticed a few standard adjustments needed to align with our standard freelance service terms.\n\nHere are the specific points I'd like to update:`;
  } else if (tone === 'direct') {
    intro = `Hi ${clientName},\n\nI have reviewed the agreement and am eager to kick off the project. I have outlined a few key revisions below to ensure balanced risk and standard payment protections for both sides.\n\nPlease review these requested redlines:`;
  } else {
    intro = `Dear ${clientName},\n\nThank you for transmitting the draft contract. Upon legal review, several clauses contain terms that create significant financial exposure and IP risk for my business. I cannot execute the agreement as currently written.\n\nTo move forward, the following amendments must be incorporated into the contract:`;
  }

  const clauseBullets = selectedClauses.map((clause, idx) => {
    return `${idx + 1}. **${clause.sectionTitle} (${clause.title})**\n   - *Current Term:* "${clause.originalSnippet.slice(0, 100)}..."\n   - *Requested Update:* ${clause.fixRecommendation}`;
  }).join('\n\n');

  const outro = `\n\nOnce these updates are incorporated, I will be ready to sign immediately and kick off the deliverables.\n\nPlease let me know if you can send over the updated contract draft!\n\nBest regards,\n${freelancerName}`;

  return `${intro}\n\n${clauseBullets}${outro}`;
}
