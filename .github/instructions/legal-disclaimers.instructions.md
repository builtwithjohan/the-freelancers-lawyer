---
applyTo: "**/*.{ts,tsx,js,jsx,py}"
description: "Guidelines for ensuring AI-generated legal outputs include mandatory disclaimers, proper sanitization, and compliance safeguards."
---

# Legal Disclaimers & Compliance Guidelines

When implementing features that generate or display contract reviews, legal clause analysis, or liability advice:

1. **Mandatory Disclaimer**: Always ensure user-facing outputs present the standard legal disclaimer:
   > *"The information provided by The Freelancer's Lawyer is for general informational purposes only and does not constitute formal legal representation or legal advice."*

2. **PII & NDA Protection**:
   - Redact or mask client names, rates, and personal identification data before processing contracts through LLM prompts unless explicitly consented to by the user.

3. **Structured Outputs**:
   - Use strict schema validation (e.g., Zod, Pydantic) for all AI contract extraction outputs to guarantee risk levels (`low`, `medium`, `high`, `critical`) and actionable recommendations are reliably formatted.
