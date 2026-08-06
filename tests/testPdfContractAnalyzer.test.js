import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pdfjsLib from 'pdfjs-dist/legacy/build/pdf.js';
import { analyzeContract } from '../src/utils/contractAnalyzer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pdfDir = path.join(__dirname, '../test-contracts/pdf');

async function extractTextFromPdfBuffer(buffer) {
  const data = new Uint8Array(buffer);
  const loadingTask = pdfjsLib.getDocument({ data, useSystemFonts: true, disableFontFace: true });
  const pdf = await loadingTask.promise;

  let text = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map(item => item.str).join(' ');
    text += pageText + '\n\n';
  }
  return text;
}

async function runPdfTests() {
  console.log('📄 RUNNING TRICKY PDF CONTRACT THREAT TEST SUITE...\n');

  const pdfFiles = [
    { file: '01_sneaky_ip_and_moral_rights.pdf', minScore: 85, expectedRules: ['rule-ip-before-payment', 'rule-preexisting-code-grab'] },
    { file: '02_unlimited_edits_and_daily_fines.pdf', minScore: 80, expectedRules: ['rule-unlimited-revisions', 'rule-daily-delay-fines'] },
    { file: '03_net90_and_pay_when_paid.pdf', minScore: 85, expectedRules: ['rule-net90-payment', 'rule-withhold-payment', 'rule-termination-no-pay'] },
    { file: '04_uncapped_indemnity_and_audit.pdf', minScore: 85, expectedRules: ['rule-uncapped-liability', 'rule-audit-rights'] },
    { file: '05_broad_noncompete_and_nonsolicit.pdf', minScore: 80, expectedRules: ['rule-broad-noncompete'] }
  ];

  let passed = 0;
  let failed = 0;

  for (const tc of pdfFiles) {
    const pdfPath = path.join(pdfDir, tc.file);
    console.log(`--------------------------------------------------`);
    console.log(`[PDF TEST] File: ${tc.file}`);

    if (!fs.existsSync(pdfPath)) {
      console.error(`  ❌ PDF File Missing: ${pdfPath}`);
      failed++;
      continue;
    }

    const buffer = fs.readFileSync(pdfPath);
    const extractedText = await extractTextFromPdfBuffer(buffer);

    console.log(`  Extracted ${extractedText.length} chars of PDF text.`);
    const result = analyzeContract(extractedText);

    console.log(`  Calculated Screw Score: ${result.score}/100 | Badge: ${result.badge}`);
    const detectedRuleIds = result.flaggedClauses.map(c => c.ruleId);
    console.log(`  Detected Rules: ${detectedRuleIds.join(', ')}`);

    let isSuccess = true;

    if (result.score < tc.minScore) {
      console.error(`  ❌ Score below expected minimum ${tc.minScore}, got ${result.score}`);
      isSuccess = false;
    }

    tc.expectedRules.forEach(ruleId => {
      if (!detectedRuleIds.includes(ruleId)) {
        console.error(`  ❌ Missing expected rule detection: ${ruleId}`);
        isSuccess = false;
      }
    });

    if (isSuccess) {
      console.log(`  ✅ PDF TEST PASSED`);
      passed++;
    } else {
      console.log(`  ❌ PDF TEST FAILED`);
      failed++;
    }
  }

  console.log(`\n==================================================`);
  console.log(`PDF TEST SUMMARY: ${passed} PASSED | ${failed} FAILED`);
  console.log(`==================================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runPdfTests();
