import React, { useState, useMemo, useDeferredValue } from 'react';
import confetti from 'canvas-confetti';
import Navbar from './components/Navbar';
import ContractUploader from './components/ContractUploader';
import AnalysisOverview from './components/AnalysisOverview';
import ClauseInspector from './components/ClauseInspector';
import NegotiationEmailModal from './components/NegotiationEmailModal';
import ClauseSandbox from './components/ClauseSandbox';
import LegalGuide from './components/LegalGuide';
import Footer from './components/Footer';

import { PRESET_CONTRACTS } from './data/presetContracts';
import { analyzeContract, CANONICAL_LEGAL_DISCLAIMER } from './utils/contractAnalyzer';

export default function App() {
  const [activeTab, setActiveTab] = useState('inspector');
  const [contractText, setContractText] = useState(PRESET_CONTRACTS[0].text);
  const [activePresetId, setActivePresetId] = useState(PRESET_CONTRACTS[0].id);
  
  // Track applied redline amendments structurally (DI-01)
  const [appliedFixes, setAppliedFixes] = useState({});
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  // Debounce analysis using React useDeferredValue for smooth typing (DI-18)
  const deferredContractText = useDeferredValue(contractText);

  // Run real-time AI Contract Analysis on deferred contract text
  const analysis = useMemo(() => {
    return analyzeContract(deferredContractText);
  }, [deferredContractText]);

  // Handle Preset Contract Selection
  const handleSelectPreset = (preset) => {
    setContractText(preset.text);
    setActivePresetId(preset.id);
    setAppliedFixes({});
  };

  // Trigger manual scan focus (DI-14)
  const handleRunScan = () => {
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.4 }
    });
  };

  // Apply or Revert Pro-Freelancer Counter-Clause Redline (DI-01)
  const handleApplyFix = (clause) => {
    const isAlreadyFixed = appliedFixes[clause.id];

    if (isAlreadyFixed) {
      // Revert fix structurally
      if (contractText.includes(clause.fixRecommendation)) {
        setContractText(prev => prev.replace(clause.fixRecommendation, clause.originalSnippet));
      }
      setAppliedFixes(prev => {
        const next = { ...prev };
        delete next[clause.id];
        return next;
      });
    } else {
      // Apply counter-clause replacement
      if (contractText.includes(clause.originalSnippet)) {
        setContractText(prev => prev.replace(clause.originalSnippet, clause.fixRecommendation));
      } else {
        setContractText(prev => prev + `\n\n[AMENDMENT TO ${clause.sectionTitle}]: ${clause.fixRecommendation}`);
      }

      setAppliedFixes(prev => ({ ...prev, [clause.id]: true }));

      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  // Export clean redlined contract with DOM attach and readable date (DI-02, DI-17)
  const handleExportDoc = () => {
    const dateStr = new Date().toISOString().split('T')[0];
    const header = `# THE FREELANCER'S LAWYER — REDLINED CONTRACT EXPORT\n\n- **Risk Index Score:** ${analysis.score}/100 (${analysis.badge})\n- **Export Date:** ${dateStr}\n\n---\n\n`;
    const footer = `\n\n---\n\n## LEGAL DISCLAIMER\n${CANONICAL_LEGAL_DISCLAIMER}\n`;

    const fullDoc = header + contractText + footer;
    const blob = new Blob([fullDoc], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    // Attach to DOM before click to prevent browser download blocks (DI-17)
    const link = document.createElement('a');
    link.href = url;
    link.download = `Redlined_Contract_Report_${dateStr}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const fixedCount = Object.keys(appliedFixes).length;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header & Top Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentScore={analysis.score}
        onSelectPreset={handleSelectPreset}
      />

      {/* Main Container */}
      <main style={{ maxWidth: '1400px', width: '100%', margin: '28px auto', padding: '0 24px', flex: 1 }}>
        {activeTab === 'inspector' && (
          <>
            {/* Contract Selector & Upload Zone */}
            <ContractUploader
              contractText={contractText}
              setContractText={setContractText}
              onAnalyze={handleRunScan}
              onSelectPreset={handleSelectPreset}
              activePresetId={activePresetId}
            />

            {/* Risk Gauge & Executive Overview */}
            <AnalysisOverview
              analysis={analysis}
              onOpenEmailModal={() => setIsEmailModalOpen(true)}
              onExportDoc={handleExportDoc}
              fixedCount={fixedCount}
            />

            {/* Side-by-Side Clause Inspector */}
            <ClauseInspector
              contractText={contractText}
              flaggedClauses={analysis.flaggedClauses}
              onApplyFix={handleApplyFix}
              appliedFixes={appliedFixes}
            />
          </>
        )}

        {activeTab === 'sandbox' && (
          <ClauseSandbox />
        )}

        {activeTab === 'guide' && (
          <LegalGuide />
        )}
      </main>

      {/* Client Negotiation Email Generator Modal */}
      <NegotiationEmailModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        flaggedClauses={analysis.flaggedClauses}
      />

      {/* Mandatory Disclaimer Footer */}
      <Footer />
    </div>
  );
}
