import React from 'react';
import { Scale, ShieldAlert, FileText, Mail, HelpCircle, Sparkles } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, currentScore, onSelectPreset }) {
  return (
    <header className="app-header">
      <div className="header-container">
        {/* Brand */}
        <div className="brand-logo" onClick={() => setActiveTab('inspector')} style={{ cursor: 'pointer' }}>
          <div className="brand-icon">
            <Scale size={24} color="#fff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="brand-name">The Freelancer's Lawyer</span>
              <span className="brand-tag">AI Threat Engine</span>
            </div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: 0 }}>
              Protects freelancers from toxic client contract traps
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            className={`btn-secondary ${activeTab === 'inspector' ? 'pulse-glow' : ''}`}
            onClick={() => setActiveTab('inspector')}
            style={{
              background: activeTab === 'inspector' ? 'rgba(255, 59, 92, 0.15)' : 'transparent',
              borderColor: activeTab === 'inspector' ? 'var(--primary-accent)' : 'transparent',
              color: activeTab === 'inspector' ? '#ff5c77' : 'var(--text-muted)'
            }}
          >
            <ShieldAlert size={16} />
            <span>Contract Review</span>
          </button>

          <button
            className="btn-secondary"
            onClick={() => setActiveTab('sandbox')}
            style={{
              background: activeTab === 'sandbox' ? 'rgba(0, 242, 254, 0.15)' : 'transparent',
              borderColor: activeTab === 'sandbox' ? 'var(--info-cyan)' : 'transparent',
              color: activeTab === 'sandbox' ? 'var(--info-cyan)' : 'var(--text-muted)'
            }}
          >
            <Sparkles size={16} />
            <span>Clause Sandbox</span>
          </button>

          <button
            className="btn-secondary"
            onClick={() => setActiveTab('guide')}
            style={{
              background: activeTab === 'guide' ? 'rgba(255, 184, 0, 0.15)' : 'transparent',
              borderColor: activeTab === 'guide' ? 'var(--warning-amber)' : 'transparent',
              color: activeTab === 'guide' ? 'var(--warning-amber)' : 'var(--text-muted)'
            }}
          >
            <HelpCircle size={16} />
            <span>Freelancer Defense Guide</span>
          </button>
        </nav>

        {/* Score Quick Pill */}
        {currentScore !== undefined && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-glass)',
              borderRadius: '20px',
              padding: '6px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.85rem'
            }}>
              <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Screw Risk Index:</span>
              <span style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 800,
                color: currentScore >= 75 ? '#ff3b5c' : currentScore >= 40 ? '#ffb800' : '#00e676'
              }}>
                {currentScore}/100
              </span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
