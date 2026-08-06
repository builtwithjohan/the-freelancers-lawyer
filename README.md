# ⚖️ The Freelancer's Lawyer

> **AI Contract Screwer-Clause Detector & Redline Engine for Independent Contractors & Freelancers.**

[![Test and Build](https://github.com/bhasskar/the-freelancers-lawyer/actions/workflows/test-and-build.yml/badge.svg)](https://github.com/bhasskar/the-freelancers-lawyer/actions)
[![Node Version](https://img.shields.io/badge/node-%3E%3D20.0.0-blue.svg)](https://nodejs.org)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Built for Freelancers](https://img.shields.io/badge/Freelancer-Protection-ff3b5c.svg)](#)

**The Freelancer's Lawyer** is a web application and AI legal threat detection tool designed to help freelancers, software engineers, designers, and small agency owners audit client agreements before signing. It scans contract text for high-risk legal traps (Net-90 payment terms, stealth IP grabs, uncapped liabilities, unlimited revisions, delay fines) and generates pro-freelancer counter-clauses and ready-to-send client negotiation emails.

---

## ⚡ Key Features

- **☣️ "Screw You Index" (Risk Gauge 0 - 100)**: Instant overall risk scoring with hazard badges (`CRITICAL THREAT`, `HIGH RISK`, `MODERATE RISK`, `SAFE & FAIR`).
- **🔎 Side-by-Side Clause Inspector**: Real-time contract text view with colored highlights on toxic lines.
- **💀 "How It Screws You" (Plain English)**: Translates dense legal legalese into direct, plain-English impact breakdowns explaining financial and legal exposure.
- **🛡️ Pro-Freelancer Counter-Clauses**: 1-click redline replacement clauses to fix traps directly in your contract draft.
- **✉️ Client Negotiation Email Generator**: Generates customized redline emails with customizable tone (*Friendly*, *Direct*, *Firm*) and export capabilities (.TXT / Clipboard).
- **🧪 Single Clause AI Sandbox**: Quick-test individual clauses or suspicious email excerpts.
- **📚 Freelancer Defense Cheat Sheet**: Interactive reference guide covering payment protection, IP triggers, liability caps, and termination kill fees.
- **📁 Tricky Contract Test Suite (`test-contracts/`)**: Built-in test suite with 6 realistic contract test cases and automated test runner (`npm test`).

---

## 🚀 Quick Start & Installation

### Prerequisites
- **Node.js**: `v20.0.0` or higher
- **npm**: `v10.0.0` or higher

### Installation

```bash
# Clone repository
git clone https://github.com/bhasskar/the-freelancers-lawyer.git
cd the-freelancers-lawyer

# Install dependencies
npm install

# Start local development server
npm run dev
```

Open `http://localhost:3000` in your browser.

---

## 🧪 Running Automated Tests

The repository includes a dedicated test suite with 6 realistic contract scenarios in `test-contracts/`:

```bash
# Run contract threat detection test suite
npm test
```

### Test Suite Summary (`test-contracts/`)

| File | Scenario | Key Traps Flagged |
| :--- | :--- | :--- |
| `01_sneaky_ip_and_moral_rights.md` | Stealth IP & Moral Rights Grab | Seizes developer personal tools, open-source libraries, waives portfolio rights. |
| `02_unlimited_edits_and_daily_fines.md` | Unlimited Edits & Delay Fines | Unlimited revisions, $1,000/day delay penalties. |
| `03_net90_and_pay_when_paid.md` | Net-90 & Pay-When-Paid | Net-90 payment terms, pay-when-paid clause, termination without pay. |
| `04_uncapped_indemnity_and_audit.md` | Uncapped Liability & Hard Drive Audit | Uncapped personal liability, 24-hr notice computer file audits. |
| `05_broad_noncompete_and_nonsolicit.md` | 3-Year Global Non-Compete | 3-year industry non-compete, 5x fee liquidated damages. |
| `06_clean_freelancer_baseline.md` | Fair Freelancer Baseline | Net-15 terms, IP transfer upon 100% full payment, capped liability. |

---

## 📦 Project Architecture

```
.
├── .github/workflows/         # CI/CD workflow (GitHub Actions)
│   └── test-and-build.yml
├── src/
│   ├── components/            # UI components (Navbar, Overview, Inspector, Modal, Sandbox, Guide)
│   ├── data/                  # Preset contracts dataset
│   ├── utils/                 # AI Contract Analysis Engine & Rule Definitions
│   ├── App.jsx                # Main application entry
│   └── index.css              # Glassmorphic dark design system
├── test-contracts/            # Tricky contract test suite & test_manifest.json
├── tests/                     # Automated test runner (testContractAnalyzer.test.js)
├── AGENTS.md                  # System architecture & developer compliance guidelines
└── package.json
```

---

## ⚖️ Legal Disclaimer

> **INFORMATIONAL NOTICE:** The Freelancer's Lawyer is an automated AI contract analysis tool intended solely for educational, informational, and contract review assistance purposes. It does not constitute formal legal advice, legal representation, or an attorney-client relationship. Always consult a qualified licensed attorney in your jurisdiction for binding legal counsel and contract execution.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
