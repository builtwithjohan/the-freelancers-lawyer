import React, { useState, useMemo } from 'react';
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
import { analyzeContract } from './utils/contractAnalyzer';

export default function App() {
  const [activeTab, setActiveTab] = useState('inspector');
  const [contractText, setContractText] = useState(PRESET_CONTRACTS[0].text);
  const [activePresetId, setActivePresetId] = useState(PRESET_CONTRACTS[0].id);
  const [appliedFixes, setAppliedFixes] = useState({});
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  // Run real-time AI Contract Analysis
  const analysis = useMemo(() => {
    return analyzeContract(contractText);
  }, [contractText]);

  // Handle Preset Contract Selection
  const handleSelectPreset = (preset) => {
    setContractText(preset.text);
    setActivePresetId(preset.id);
    setAppliedFixes({});
  };

  // Trigger manual scan
  const handleRunScan = () => {
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.4 }
    });
  };

  // Apply Pro-Freelancer Counter-Clause Redline to contract
  const handleApplyFix = (clause) => {
    const isAlreadyFixed = appliedFixes[clause.id];

    if (isAlreadyFixed) {
      // Revert fix
      setContractText(prev => prev.replace(clause.fixRecommendation, clause.originalSnippet));
      setAppliedFixes(prev => ({ ...prev, [clause.id]: false }));
    } else {
      // Apply counter-clause replacement
      if (contractText.includes(clause.originalSnippet)) {
        setContractText(prev => prev.replace(clause.originalSnippet, clause.fixRecommendation));
      } else {
        // Fallback append if snippet modified
        setContractText(prev => prev + `\n\n[AMENDMENT TO ${clause.sectionTitle}]: ${clause.fixRecommendation}`);
      }

      setAppliedFixes(prev => ({ ...prev, [clause.id]: true }));

      // Trigger celebrate confetti
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  // Export clean redlined contract as Markdown/TXT file
  const handleExportDoc = () => {
    const header = `====================================================\nTHE FREELANCER'S LAWYER - REDLINED CONTRACT EXPORT\nRisk Index Score: ${analysis.score}/100 (${analysis.badge})\nExport Date: ${new Date().toLocaleDateString()}\n====================================================\n\n`;
    const fullDoc = header + contractText;
    const blob = new Blob([fullDoc], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Redlined_Contract_Report_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const fixedCount = Object.values(appliedFixes).filter(Boolean).length;

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
