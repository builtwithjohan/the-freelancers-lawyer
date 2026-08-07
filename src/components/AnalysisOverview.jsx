import React from 'react';
import { ShieldAlert, DollarSign, Lock, RefreshCw, XCircle, Slash, Gavel, Mail, Download, CheckSquare } from 'lucide-react';
import { RISK_CATEGORIES } from '../utils/contractAnalyzer';

export default function AnalysisOverview({ analysis, onOpenEmailModal, onExportDoc, onApplyAllFixes, fixedCount }) {
  const { score, badge, badgeColor, totalFlagged, categoriesCount, cleanSectionsCount } = analysis;

  // Compute gauge stroke-dasharray (Radius = 70, Circumference ≈ 440)
  const strokeDashoffset = 440 - (440 * score) / 100;

  const categoryIcons = {
    payment: DollarSign,
    ip: Lock,
    revisions: RefreshCw,
    liability: ShieldAlert,
    termination: XCircle,
    non_compete: Slash,
    jurisdiction: Gavel
  };

  return (
    <div id="analysis-overview-section" className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '28px', alignItems: 'center' }} className="grid-2col">
        {/* SVG Risk Gauge Meter */}
        <div style={{ textAlign: 'center' }}>
          <div className="score-gauge-container">
            <svg className="score-gauge-circle" viewBox="0 0 160 160">
              <circle
                cx="80"
                cy="80"
                r="70"
                fill="transparent"
                stroke="rgba(255, 255, 255, 0.08)"
                strokeWidth="14"
              />
              <circle
                cx="80"
                cy="80"
                r="70"
                fill="transparent"
                stroke={badgeColor}
                strokeWidth="14"
                strokeDasharray="440"
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.16, 1, 0.3, 1)' }}
              />
            </svg>
            <div className="score-value">
              <div className="score-number" style={{ color: badgeColor }}>
                {score}
              </div>
              <div className="score-label">Screw Score</div>
            </div>
          </div>

          <div style={{ marginTop: '12px' }}>
            <span
              className="badge-threat"
              style={{
                background: `${badgeColor}25`,
                color: badgeColor,
                border: `1px solid ${badgeColor}88`,
                fontSize: '0.82rem',
                padding: '6px 14px'
              }}
            >
              {badge}
            </span>
          </div>
        </div>

        {/* Executive Summary & Threat Breakdown */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 800 }}>
                AI Legal Threat Diagnostics
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                Identified <strong style={{ color: '#ff5c77' }}>{totalFlagged} dangerous terms</strong> across {Object.keys(categoriesCount).length} threat categories.
                {fixedCount > 0 && (
                  <span style={{ color: '#00e676', marginLeft: '8px', fontWeight: 700 }}>
                    ({fixedCount} counter-clauses applied!)
                  </span>
                )}
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button className="btn-primary" onClick={onOpenEmailModal} style={{ fontSize: '0.85rem', padding: '10px 16px' }}>
                <Mail size={16} />
                <span>Generate Client Email</span>
              </button>

              <button className="btn-secondary" onClick={onExportDoc} style={{ fontSize: '0.85rem', padding: '10px 16px' }}>
                <Download size={16} />
                <span>Export Redlines</span>
              </button>
            </div>
          </div>

          {/* Category Risk Pills */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '10px', marginTop: '16px' }}>
            {Object.entries(RISK_CATEGORIES).map(([key, cat]) => {
              const count = categoriesCount[cat.id] || 0;
              const IconComp = categoryIcons[cat.id] || ShieldAlert;
              const hasThreat = count > 0;

              return (
                <div
                  key={cat.id}
                  style={{
                    background: hasThreat ? 'rgba(255, 59, 92, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                    border: hasThreat ? '1px solid rgba(255, 59, 92, 0.25)' : '1px solid rgba(255, 255, 255, 0.05)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '10px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '10px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <IconComp size={16} color={hasThreat ? '#ff5c77' : 'var(--text-dim)'} />
                    <span style={{ fontSize: '0.78rem', fontWeight: 600, color: hasThreat ? 'var(--text-main)' : 'var(--text-dim)' }}>
                      {cat.name.split('&')[0]}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: '10px',
                      background: hasThreat ? '#ff3b5c' : 'rgba(255,255,255,0.1)',
                      color: '#fff'
                    }}
                  >
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
