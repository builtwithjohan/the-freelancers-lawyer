import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2, RefreshCw, FileText, ArrowRight, ShieldCheck, Sparkles, Copy, ExternalLink } from 'lucide-react';

export default function ClauseInspector({ contractText, flaggedClauses, onApplyFix, appliedFixes }) {
  const [activeClauseId, setActiveClauseId] = useState(flaggedClauses[0]?.id || null);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('ALL');
  const [copiedId, setCopiedId] = useState(null);

  const filteredClauses = selectedCategoryFilter === 'ALL'
    ? flaggedClauses
    : flaggedClauses.filter(c => c.category === selectedCategoryFilter);

  const activeClause = flaggedClauses.find(c => c.id === activeClauseId) || flaggedClauses[0];

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }} className="grid-2col">
      {/* Left Column: Interactive Document View with Highlighted Traps */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText color="var(--info-cyan)" size={20} />
              <span>Contract Text Inspector</span>
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Click any highlighted line to inspect the trap breakdown
            </p>
          </div>
          <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.06)', padding: '4px 10px', borderRadius: '12px' }}>
            {flaggedClauses.length} Flagged Terms
          </span>
        </div>

        {/* Highlighted Contract Scroll View */}
        <div className="contract-viewer-paper" style={{ flex: 1 }}>
          {contractText.split('\n\n').map((paragraph, pIdx) => {
            // Check if paragraph contains any flagged clause originalSnippet
            const matchingClause = flaggedClauses.find(c =>
              paragraph.toLowerCase().includes(c.originalSnippet.toLowerCase().slice(0, 40))
            );

            if (matchingClause) {
              const isSelected = activeClauseId === matchingClause.id;
              const isFixed = appliedFixes[matchingClause.id];

              return (
                <div
                  key={pIdx}
                  onClick={() => setActiveClauseId(matchingClause.id)}
                  className={`highlight-clause ${matchingClause.severity} ${isSelected ? 'active' : ''}`}
                  style={{
                    marginBottom: '16px',
                    padding: '12px',
                    borderRadius: 'var(--radius-sm)',
                    background: isFixed
                      ? 'rgba(0, 230, 118, 0.12)'
                      : isSelected
                      ? 'rgba(255, 59, 92, 0.2)'
                      : 'rgba(255, 59, 92, 0.08)',
                    borderLeft: `4px solid ${isFixed ? '#00e676' : matchingClause.severity === 'CRITICAL' ? '#ff3b5c' : '#ffb800'}`
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span className={`badge-threat ${matchingClause.severity}`} style={{ fontSize: '0.7rem' }}>
                      {matchingClause.severity} • {matchingClause.sectionTitle}
                    </span>
                    {isFixed ? (
                      <span style={{ color: '#00e676', fontSize: '0.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <CheckCircle2 size={12} /> REDLINED
                      </span>
                    ) : (
                      <span style={{ color: '#ff5c77', fontSize: '0.75rem', fontWeight: 700 }}>
                        Click to Inspect →
                      </span>
                    )}
                  </div>
                  <div>{paragraph}</div>
                </div>
              );
            }

            return (
              <p key={pIdx} style={{ marginBottom: '14px', color: '#9ca3af' }}>
                {paragraph}
              </p>
            );
          })}
        </div>
      </div>

      {/* Right Column: Clause Deep Dive & Counter-Proposal Engine */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle color="#ff3b5c" size={20} />
              <span>Clause Risk Analysis & Redline</span>
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Deep-dive explanation & pro-freelancer replacement clause
            </p>
          </div>

          {/* Clause Tabs selector */}
          <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', maxWidth: '200px' }}>
            {flaggedClauses.map((c, i) => (
              <button
                key={c.id}
                onClick={() => setActiveClauseId(c.id)}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  border: 'none',
                  background: activeClauseId === c.id ? '#ff3b5c' : appliedFixes[c.id] ? '#00e676' : 'rgba(255,255,255,0.1)',
                  color: '#fff',
                  fontWeight: 800,
                  fontSize: '0.75rem',
                  cursor: 'pointer'
                }}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>

        {activeClause ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Clause Header Banner */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-glass)',
                borderRadius: 'var(--radius-md)',
                padding: '16px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span className={`badge-threat ${activeClause.severity}`}>
                  {activeClause.severity} HAZARD
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 600 }}>
                  Category: {activeClause.categoryInfo?.name || activeClause.category}
                </span>
              </div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', margin: '4px 0' }}>
                {activeClause.title}
              </h4>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {activeClause.sectionTitle}
              </div>
            </div>

            {/* Original Legalese Snippet */}
            <div style={{ background: '#0b0f19', borderRadius: 'var(--radius-sm)', padding: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Original Contract Legalese:
              </div>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: '#e2e8f0', fontStyle: 'italic', lineHeight: 1.5 }}>
                "{activeClause.originalSnippet}"
              </p>
            </div>

            {/* "How it Screws You" Plain English Translation */}
            <div className="screw-box">
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, color: '#ff3b5c', marginBottom: '6px', fontSize: '0.85rem' }}>
                <AlertTriangle size={16} /> HOW THIS SCREWS YOU (PLAIN ENGLISH):
              </div>
              <p style={{ margin: 0, lineHeight: 1.5, color: '#ffd1d9', fontSize: '0.88rem' }}>
                {activeClause.plainEnglish}
              </p>
            </div>

            {/* Legal Warning Detail */}
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', background: 'rgba(255, 184, 0, 0.05)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid #ffb800' }}>
              <strong>Legal Risk:</strong> {activeClause.legalWarning}
            </div>

            {/* Pro-Freelancer Counter-Clause Recommendation */}
            <div className="fix-box" style={{ marginTop: 'auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontWeight: 800, color: '#00e676', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
                  <ShieldCheck size={16} /> PRO-FREELANCER REPLACEMENT CLAUSE:
                </span>
                <button
                  onClick={() => handleCopy(activeClause.fixRecommendation, activeClause.id)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: copiedId === activeClause.id ? '#00e676' : 'var(--text-muted)',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Copy size={12} /> {copiedId === activeClause.id ? 'Copied!' : 'Copy Text'}
                </button>
              </div>

              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: '#e6fffa', lineHeight: 1.5, margin: 0 }}>
                {activeClause.fixRecommendation}
              </p>

              <div style={{ marginTop: '14px', display: 'flex', gap: '10px' }}>
                <button
                  className={appliedFixes[activeClause.id] ? "btn-outline-safe" : "btn-primary"}
                  onClick={() => onApplyFix(activeClause)}
                  style={{ flex: 1, justifyContent: 'center', fontSize: '0.85rem' }}
                >
                  {appliedFixes[activeClause.id] ? (
                    <>
                      <CheckCircle2 size={16} /> Counter-Clause Applied!
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} /> Apply Counter-Clause Redline
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
            No dangerous clauses found in this contract!
          </div>
        )}
      </div>
    </div>
  );
}
