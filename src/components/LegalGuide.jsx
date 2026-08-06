import React from 'react';
import { ShieldCheck, DollarSign, Lock, ShieldAlert, RefreshCw, XCircle, Slash, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function LegalGuide() {
  const CHEAT_SHEET_PILLARS = [
    {
      title: '1. Payment & Deposit Protection',
      icon: DollarSign,
      color: '#00e676',
      goldStandard: '50% Upfront Deposit + Net-15 or Net-30 Payment Terms + 1.5% Monthly Late Interest.',
      dangerTrap: 'Net-90 payment terms or "Pay-When-Paid" clauses that force you to fund client cashflow.',
      proTip: 'Never start work without a non-refundable deposit clearing in your bank account first.'
    },
    {
      title: '2. IP Rights & Ownership Trigger',
      icon: Lock,
      color: '#00f2fe',
      goldStandard: 'IP and copyright transfer to Client ONLY UPON RECEIPT OF 100% FULL PAYMENT.',
      dangerTrap: 'Clause stating IP transfers "immediately upon creation regardless of whether payment has been made."',
      proTip: 'If they do not pay your invoice, you still legally own the code/design and can issue a DMCA takedown.'
    },
    {
      title: '3. Limitation of Liability',
      icon: ShieldAlert,
      color: '#ffb800',
      goldStandard: 'Liability is capped to the total amount of money actually paid under the agreement.',
      dangerTrap: 'Uncapped financial liability or unilateral agreement to pay client legal defense fees.',
      proTip: 'Without a liability cap, a single $5k project could result in a $500k lawsuit wiping out your personal savings.'
    },
    {
      title: '4. Scope Creep & Revision Limits',
      icon: RefreshCw,
      color: '#ff7a45',
      goldStandard: 'Two (2) rounds of minor revisions included; further edits require a formal Change Order.',
      dangerTrap: '"Unlimited revisions until Client absolute satisfaction."',
      proTip: 'Define specific deliverables in an attached SOW (Statement of Work) to prevent endless free rewrites.'
    },
    {
      title: '5. Termination & Kill Fees',
      icon: XCircle,
      color: '#ff3b5c',
      goldStandard: '14-day written notice required + full payment for work completed + 25% kill fee.',
      dangerTrap: 'Client may terminate "at any time without notice or obligation to compensate Contractor."',
      proTip: 'Always protect your reserved calendar time with a non-negotiable termination kill fee.'
    },
    {
      title: '6. Non-Competes vs NDAs',
      icon: Slash,
      color: '#7928ca',
      goldStandard: 'Mutual Non-Disclosure Agreement (NDA) protecting client secrets, with NO non-compete.',
      dangerTrap: '3-year global non-compete barring you from working for any company in the client’s industry.',
      proTip: 'Never sign a non-compete unless the client is paying your full annual salary during the lockout period.'
    }
  ];

  return (
    <div className="glass-panel" style={{ padding: '28px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ShieldCheck color="#00e676" size={26} />
          <span>Freelancer's Legal Protection Cheat Sheet</span>
        </h2>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '4px' }}>
          The golden rules of client contracts every independent contractor, engineer, and designer must enforce.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px' }}>
        {CHEAT_SHEET_PILLARS.map((pillar, idx) => {
          const IconComp = pillar.icon;
          return (
            <div
              key={idx}
              className="glass-card"
              style={{
                borderLeft: `4px solid ${pillar.color}`,
                background: 'rgba(255, 255, 255, 0.02)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-sm)',
                  background: `${pillar.color}22`,
                  color: pillar.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <IconComp size={20} />
                </div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff' }}>
                  {pillar.title}
                </h4>
              </div>

              {/* Gold Standard */}
              <div style={{ background: 'rgba(0, 230, 118, 0.06)', border: '1px solid rgba(0, 230, 118, 0.2)', borderRadius: 'var(--radius-sm)', padding: '10px 12px', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#00e676', display: 'flex', alignItems: 'center', gap: '4px', textTransform: 'uppercase' }}>
                  <CheckCircle2 size={12} /> Gold Standard Rule:
                </span>
                <p style={{ fontSize: '0.82rem', color: '#e6fffa', margin: '4px 0 0 0', lineHeight: 1.4 }}>
                  {pillar.goldStandard}
                </p>
              </div>

              {/* Danger Trap */}
              <div style={{ background: 'rgba(255, 59, 92, 0.06)', border: '1px solid rgba(255, 59, 92, 0.2)', borderRadius: 'var(--radius-sm)', padding: '10px 12px', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#ff5c77', display: 'flex', alignItems: 'center', gap: '4px', textTransform: 'uppercase' }}>
                  <AlertTriangle size={12} /> Danger Trap:
                </span>
                <p style={{ fontSize: '0.82rem', color: '#ffd1d9', margin: '4px 0 0 0', lineHeight: 1.4 }}>
                  {pillar.dangerTrap}
                </p>
              </div>

              {/* Pro Tip */}
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontStyle: 'italic', margin: '6px 0 0 0' }}>
                💡 <strong>Pro Tip:</strong> {pillar.proTip}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
