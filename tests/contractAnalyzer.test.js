import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { analyzeContract } from '../src/utils/contractAnalyzer.js';
import { CANONICAL_LEGAL_DISCLAIMER } from '../src/utils/constants.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const testDataDir = path.join(__dirname, '../test-contracts');

describe('Contract Threat Analyzer Suite', () => {
  const manifestPath = path.join(testDataDir, 'test_manifest.json');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

  manifest.testCases.forEach((tc) => {
    it(`should correctly audit ${tc.id}: ${tc.name}`, () => {
      const filePath = path.join(testDataDir, tc.file);
      const content = fs.readFileSync(filePath, 'utf8');

      const result = analyzeContract(content);

      expect(result.score).toBeGreaterThanOrEqual(tc.expectedMinScore);
      expect(result.score).toBeLessThanOrEqual(tc.expectedMaxScore);
      expect(result.disclaimer).toBe(CANONICAL_LEGAL_DISCLAIMER);

      const detectedRuleIds = result.flaggedClauses.map(c => c.ruleId);
      tc.expectedRuleIds.forEach((ruleId) => {
        expect(detectedRuleIds).toContain(ruleId);
      });
    });
  });

  it('should include canonical disclaimer in generated negotiation email (DI-02)', async () => {
    const { generateNegotiationEmail } = await import('../src/utils/negotiationEmail.js');
    const email = generateNegotiationEmail({ clientName: 'Acme', freelancerName: 'Alex' });
    expect(email).toContain(CANONICAL_LEGAL_DISCLAIMER);
  });
});
