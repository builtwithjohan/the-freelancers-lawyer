/**
 * High-threat legal rules and risk categories definition
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

export const ANALYSIS_RULES = [
  {
    id: 'rule-net90-payment',
    category: 'payment',
    title: 'Excessive Payment Window (Net-60/90+)',
    severity: 'HIGH',
    screwScore: 88,
    // Contextual match: payment within 60/90 days or Net-60/90 terms
    regex: /(pay|payment|remit|compensation|invoice).*?\b(within\s*(ninety|sixty|90|60|\(\s*90\s*\)|\(\s*60\s*\))\s*\(?\d*\)?\s*days|net\s*(90|60)|60\s+days|90\s+days)\b|\bnet\s*(90|60)\b/is,
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
    // Ensure discretion belongs to Client, not Contractor
    regex: /(client\'s?\s+(sole|absolute)\s+discretion|right to withhold payment|sole and (absolute|subjective) satisfaction|does not meet quality|refuse to pay)/is,
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
    regex: /(regardless of whether payment|immediately upon creation|prior to the term|prior to execution|transfers and conveys.*regardless)/is,
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
    // Cross-line matching flag s to capture multi-sentence pre-existing code grabs
    regex: /(pre-existing|personal libraries|boilerplates|background code).*?(become|property of client|exclusive property|forfeits|shall belong|transfers to client|sole and exclusive property)/is,
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
    regex: /(moral rights|attribution rights|retains zero ownership|portfolio waiver|forfeits all rights to reuse)/is,
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
    regex: /(unlimited revisions|without additional compensation|total satisfaction|absolute satisfaction)/is,
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
    regex: /(liquidated damages|\$\d+ per (calendar )?day|delay penalties|time is of the essence)/is,
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
    regex: /(no obligation to compensate|at any time for any reason|immediate notice|without paying|termination for convenience without compensation)/is,
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
    regex: /(non-compete|same industry|business sector|period of (two|three|2|3) years|any client, vendor, or contact)/is,
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
    regex: /(uncapped financial liability|indemnify, defend, and hold harmless|without limitation|waiver of liability caps|all claims, damages, liabilities)/is,
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
    regex: /(audit (contractor|designer|vendor)\'s|file systems|accounting ledgers|personal computer)/is,
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
    // Contextual: courts of Delaware, jurisdiction in Delaware, laws of Delaware
    regex: /(courts of Delaware|jurisdiction.*Delaware|laws of the State of Delaware|reimburse client for all legal fees|exclusive jurisdiction.*Delaware)/is,
    plainEnglish: 'If a payment dispute happens, you have to fly across the country to hire an expensive out-of-state trial lawyer in Delaware, making suing for your money financially impossible.',
    legalWarning: 'Inconvenient forum clauses force small freelancers to abandon legitimate payment claims.',
    fixRecommendation: 'Set jurisdiction to Contractor’s home state/city, or require mutual binding online arbitration (AAA/JAMS) with each party bearing their own legal costs.'
  }
];
