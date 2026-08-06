import React, { useState } from 'react';
import { X, Mail, Copy, Download, Check, Sparkles, Send } from 'lucide-react';
import { generateNegotiationEmail } from '../utils/contractAnalyzer';

export default function NegotiationEmailModal({ isOpen, onClose, flaggedClauses }) {
  if (!isOpen) return null;

  const [clientName, setClientName] = useState('Acme Corp');
  const [freelancerName, setFreelancerName] = useState('Alex Rivera');
  const [tone, setTone] = useState('direct'); // polite, direct, strict
  const [selectedIds, setSelectedIds] = useState(
    flaggedClauses.map(c => c.id)
  );
  const [copied, setCopied] = useState(false);

  const selectedClauses = flaggedClauses.filter(c => selectedIds.includes(c.id));
  const emailText = generateNegotiationEmail({
    clientName,
    freelancerName,
    selectedClauses,
    tone
  });

  const toggleClauseSelection = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(emailText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([emailText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Contract_Negotiation_Email_${clientName.replace(/\s+/g, '_')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(255, 59, 92, 0.15)',
              color: '#ff5c77',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Mail size={22} />
            </div>
            <div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 800 }}>
                Generate Client Negotiation Email
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
                Professional redline negotiation draft ready to send back to client
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '6px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Controls */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '16px' }} className="grid-2col">
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
              Client Name / Company
            </label>
            <input
              type="text"
              value={clientName}
              onChange={e => setClientName(e.target.value)}
              style={{
                width: '100%',
                background: '#0b0f19',
                border: '1px solid var(--border-glass)',
                borderRadius: 'var(--radius-sm)',
                padding: '8px 12px',
                color: '#fff',
                fontSize: '0.85rem'
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
              Your Name / Studio
            </label>
            <input
              type="text"
              value={freelancerName}
              onChange={e => setFreelancerName(e.target.value)}
              style={{
                width: '100%',
                background: '#0b0f19',
                border: '1px solid var(--border-glass)',
                borderRadius: 'var(--radius-sm)',
                padding: '8px 12px',
                color: '#fff',
                fontSize: '0.85rem'
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
              Negotiation Tone
            </label>
            <select
              value={tone}
              onChange={e => setTone(e.target.value)}
              style={{
                width: '100%',
                background: '#0b0f19',
                border: '1px solid var(--border-glass)',
                borderRadius: 'var(--radius-sm)',
                padding: '8px 12px',
                color: '#fff',
                fontSize: '0.85rem'
              }}
            >
              <option value="polite">Friendly & Collaborative</option>
              <option value="direct">Direct & Professional (Recommended)</option>
              <option value="strict">Firm Legal Defense</option>
            </select>
          </div>
        </div>

        {/* Clauses to Include Checklist */}
        <div style={{ marginBottom: '16px', background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-dim)', marginBottom: '8px' }}>
            SELECT CLAUSES TO INCLUDE IN EMAIL ({selectedClauses.length}/{flaggedClauses.length}):
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {flaggedClauses.map(clause => {
              const isChecked = selectedIds.includes(clause.id);
              return (
                <label
                  key={clause.id}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.78rem',
                    background: isChecked ? 'rgba(255, 59, 92, 0.15)' : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${isChecked ? '#ff3b5c' : 'transparent'}`,
                    padding: '4px 10px',
                    borderRadius: '14px',
                    cursor: 'pointer',
                    color: isChecked ? '#fff' : 'var(--text-dim)'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleClauseSelection(clause.id)}
                    style={{ cursor: 'pointer' }}
                  />
                  <span>{clause.title}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Email Preview Box */}
        <div style={{ background: '#0b0f19', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)', padding: '16px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 700 }}>
              EMAIL BODY PREVIEW
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--info-cyan)' }}>
              Ready to send to client
            </span>
          </div>
          <textarea
            readOnly
            value={emailText}
            rows={10}
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              color: '#d1d5db',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.82rem',
              lineHeight: 1.6,
              resize: 'none',
              outline: 'none'
            }}
          />
        </div>

        {/* Actions Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button className="btn-secondary" onClick={onClose}>
            Close
          </button>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn-secondary" onClick={handleDownload}>
              <Download size={16} /> Download .TXT
            </button>
            <button className="btn-primary" onClick={handleCopy}>
              {copied ? <Check size={16} /> : <Copy size={16} />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Negotiation Email'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
