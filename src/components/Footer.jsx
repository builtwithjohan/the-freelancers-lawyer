import React from 'react';
import { Shield, Scale } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ marginTop: '50px', borderTop: '1px solid var(--border-glass)', padding: '30px 24px', background: 'rgba(9, 13, 22, 0.9)' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
          <Scale size={18} color="var(--primary-accent)" />
          <strong style={{ color: '#fff' }}>The Freelancer's Lawyer</strong> — AI Contract Screwer-Clause Detector
        </div>

        {/* Legal Disclaimer Box as required by AGENTS.md */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          borderRadius: 'var(--radius-sm)',
          padding: '14px 20px',
          maxWidth: '900px',
          margin: '0 auto',
          fontSize: '0.76rem',
          color: 'var(--text-dim)',
          lineHeight: 1.6
        }}>
          <strong style={{ color: 'var(--text-muted)' }}>LEGAL DISCLAIMER & INFORMATIONAL NOTICE:</strong> The Freelancer's Lawyer is an automated AI contract analysis tool intended solely for educational, informational, and contract review assistance purposes. It does not constitute formal legal advice, legal representation, or an attorney-client relationship. Always consult a qualified licensed attorney in your jurisdiction for binding legal counsel and contract execution.
        </div>

        <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', margin: 0 }}>
          Built for independent contractors, freelancers, software engineers, and creative agencies worldwide.
        </p>
      </div>
    </footer>
  );
}
