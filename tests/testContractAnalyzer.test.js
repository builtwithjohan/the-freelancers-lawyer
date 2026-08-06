import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { analyzeContract } from '../src/utils/contractAnalyzer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const testDataDir = path.join(__dirname, '../test-contracts');

console.log('⚖️ RUNNING THE FREELANCER\'S LAWYER AI THREAT TEST SUITE...\n');

const manifestPath = path.join(testDataDir, 'test_manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

let passedCount = 0;
let failedCount = 0;

manifest.testCases.forEach((tc) => {
  const filePath = path.join(testDataDir, tc.file);
  const content = fs.readFileSync(filePath, 'utf8');

  console.log(`--------------------------------------------------`);
  console.log(`[TEST CASE] ${tc.id}: ${tc.name}`);
  console.log(`  File: ${tc.file}`);

  const result = analyzeContract(content);

  console.log(`  Calculated Score: ${result.score}/100 | Badge: ${result.badge}`);
  console.log(`  Flagged Clauses Count: ${result.totalFlagged}`);

  const detectedRuleIds = result.flaggedClauses.map(c => c.ruleId);
  console.log(`  Detected Rules: ${detectedRuleIds.join(', ') || 'None'}`);

  let tcSuccess = true;

  // Verify expected score range
  if (result.score < tc.expectedMinScore || result.score > tc.expectedMaxScore) {
    console.error(`  ❌ SCORE OUT OF RANGE: Expected between ${tc.expectedMinScore}-${tc.expectedMaxScore}, got ${result.score}`);
    tcSuccess = false;
  }

  // Verify expected rules detected
  tc.expectedRuleIds.forEach((ruleId) => {
    if (!detectedRuleIds.includes(ruleId)) {
      console.error(`  ❌ MISSING EXPECTED THREAT RULE: ${ruleId}`);
      tcSuccess = false;
    }
  });

  if (tcSuccess) {
    console.log(`  ✅ PASSED`);
    passedCount++;
  } else {
    console.log(`  ❌ FAILED`);
    failedCount++;
  }
});

console.log(`\n==================================================`);
console.log(`TEST SUMMARY: ${passedCount} PASSED | ${failedCount} FAILED`);
console.log(`==================================================\n`);

if (failedCount > 0) {
  process.exit(1);
}
