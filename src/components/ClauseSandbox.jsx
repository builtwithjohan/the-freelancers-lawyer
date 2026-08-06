import React, { useState } from 'react';
import { Sparkles, AlertTriangle, ShieldCheck, Copy, Check, HelpCircle } from 'lucide-react';
import { analyzeContract } from '../utils/contractAnalyzer';

export default function ClauseSandbox() {
  const [inputClause, setInputClause] = useState(
    'Developer agrees that all pre-existing libraries, design tokens, and personal tools used during the project shall become the exclusive property of Client immediately upon execution of this contract.'
  );
  const [analysisResult, setAnalysisResult] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleTestClause = () => {
    if (!inputClause.trim()) return;
    const res = analyzeContract(inputClause);
    setAnalysisResult(res);
  };

  const handleCopyFix = (fixText) => {
    navigator.clipboard.writeText(fixText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-panel" style={{ padding: '28px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Sparkles color="var(--info-cyan)" size={24} />
          <span>Single Clause AI Risk Sandbox</span>
        </h2>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '4px' }}>
          Have a suspicious paragraph from an email or contract draft? Paste it below to test its threat level instantly.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }} className="grid-2col">
        {/* Input Box */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>
            PASTE SUSPECTED CLAUSE OR SENTENCE:
          </label>
          <textarea
            value={inputClause}
            onChange={(e) => setInputClause(e.target.value)}
            placeholder="e.g. Contractor shall indemnify and hold Client harmless from any claims..."
            rows={8}
            style={{
              width: '100%',
              background: '#0b0f19',
              border: '1px solid var(--border-glass)',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              color: '#fff',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.88rem',
              lineHeight: 1.6,
              resize: 'vertical',
              outline: 'none'
            }}
          />
          <div style={{ marginTop: '14px', display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn-primary" onClick={handleTestClause}>
              <Sparkles size={16} />
              <span>Analyze Clause Threat</span>
            </button>
          </div>
        </div>

        {/* Output Diagnostics Box */}
        <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-md)', padding: '20px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-dim)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            AI Threat Result:
          </div>

          {analysisResult ? (
            <div>
              {analysisResult.flaggedClauses.length > 0 ? (
                analysisResult.flaggedClauses.map((flag) => (
                  <div key={flag.id} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span className={`badge-threat ${flag.severity}`}>
                        {flag.severity} RISK ({flag.screwScore}/100)
                      </span>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                        {flag.categoryInfo?.name}
                      </span>
                    </div>

                    <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff' }}>
                      {flag.title}
                    </h4>

                    <div className="screw-box">
                      <strong style={{ color: '#ff3b5c', display: 'block', marginBottom: '4px' }}>
                        💀 HOW IT SCREWS YOU:
                      </strong>
                      <p style={{ margin: 0, fontSize: '0.85rem' }}>{flag.plainEnglish}</p>
                    </div>

                    <div className="fix-box">
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <strong style={{ color: '#00e676', fontSize: '0.85rem' }}>
                          🛡️ PRO-FREELANCER REWRITE:
                        </strong>
                        <button
                          onClick={() => handleCopyFix(flag.fixRecommendation)}
                          style={{ background: 'transparent', border: 'none', color: copied ? '#00e676' : 'var(--text-muted)', cursor: 'pointer', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                          <Copy size={12} /> {copied ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                      <p style={{ margin: 0, fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#e6fffa' }}>
                        {flag.fixRecommendation}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '30px 10px', color: '#00e676' }}>
                  <ShieldCheck size={36} style={{ marginBottom: '8px' }} />
                  <h4 style={{ fontSize: '1rem', fontWeight: 800 }}>No Known Threat Rules Triggered</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    This specific sentence does not match standard high-risk traps in our database. Always review full context.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-dim)', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <HelpCircle size={32} style={{ marginBottom: '8px', opacity: 0.5 }} />
              <p style={{ fontSize: '0.85rem' }}>Click "Analyze Clause Threat" above to test your pasted clause.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
