# AGENTS.md — The Freelancer's Lawyer

Guidance for AI coding agents working on **The Freelancer's Lawyer** codebase.

## Overview

**The Freelancer's Lawyer** is a web application and legal assistance tool designed to help independent contractors, freelancers, and small agency owners manage contracts, review client agreements, resolve payment disputes, and navigate intellectual property and compliance requirements.

## Core Domain & System Architecture

- **Domain Model**: Contracts, Clauses, Client Agreements, Invoices, Disputes, Intellectual Property (IP) Ownership, Jurisdiction Rules.
- **AI/LLM Layer**: Structured legal analysis, contract parsing, risk scoring, and clause comparison.
- **Security & Privacy**: Strict data confidentiality (protect client NDAs, personal identifying information, and sensitive contract terms).

## Key Development Guidelines

1. **Legal Disclaimers & Compliance**:
   - Every AI-generated legal review or output must include appropriate disclaimers stating that generated content is for informational purposes and does not constitute formal legal counsel.
   - Guard against hallucinations in contract clause interpretations or jurisdiction-specific statutory references.

2. **Data Confidentiality & Privacy**:
   - Do not log user contract text, personal data, or PII to console or telemetry.
   - Sanitize or redact sensitive financial and personal information before sending payloads to external logging/analytics services.

3. **Code Style & Architecture**:
   - Maintain clear separation of concerns between domain logic, UI components, and LLM orchestration/RAG pipelines.
   - Use strongly typed interfaces/data transfer objects (DTOs) for contract schema definitions.

4. **Testing & Quality Verification**:
   - Validate LLM prompt outputs using structured JSON schemas or output parsers.
   - Write automated tests for contract parsing, risk score calculations, and data transformation pipelines.
