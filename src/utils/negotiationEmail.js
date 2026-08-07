/**
 * Negotiation Email Generator for Client Counter-Proposals
 */

import { CANONICAL_LEGAL_DISCLAIMER } from './constants.js';

export function generateNegotiationEmail({
  clientName = 'Client',
  freelancerName = 'Freelancer',
  selectedClauses = [],
  tone = 'direct'
}) {
  if (!selectedClauses || selectedClauses.length === 0) {
    return `Hi ${clientName},\n\nThanks for sending over the contract! I've reviewed the terms and overall everything looks good. Let's move forward.\n\nBest regards,\n${freelancerName}\n\n---\n${CANONICAL_LEGAL_DISCLAIMER}`;
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

  const outro = `\n\nOnce these updates are incorporated, I will be ready to sign immediately and kick off the deliverables.\n\nPlease let me know if you can send over the updated contract draft!\n\nBest regards,\n${freelancerName}\n\n---\n${CANONICAL_LEGAL_DISCLAIMER}`;

  return `${intro}\n\n${clauseBullets}${outro}`;
}
