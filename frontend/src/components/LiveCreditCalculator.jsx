import React from 'react';
import { Calculator } from 'lucide-react';

export default function LiveCreditCalculator({ theoryCredits = 0, labCredits = 0, tutorialCredits = 0, activeRule }) {
  const tMult = activeRule ? activeRule.theoryHoursPerCredit : 1.0;
  const lMult = activeRule ? activeRule.labHoursPerCredit : 2.0;
  const tutMult = activeRule ? activeRule.tutorialHoursPerCredit : 1.0;

  const theoryHours = (Number(theoryCredits) || 0) * tMult;
  const labHours = (Number(labCredits) || 0) * lMult;
  const tutorialHours = (Number(tutorialCredits) || 0) * tutMult;
  const totalWeeklyHours = theoryHours + labHours + tutorialHours;

  return (
    <div className="glass-panel" style={{ background: 'rgba(99, 102, 241, 0.05)', borderColor: 'var(--border-accent)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--accent-primary)' }}>
        <Calculator size={20} />
        <h4 style={{ margin: 0, fontSize: '1rem' }}>Live Credit-to-Hours Preview</h4>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', textAlign: 'center' }}>
        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Theory Hours/Wk</span>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '0.25rem' }}>{theoryHours} hrs</div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>({theoryCredits} x {tMult})</span>
        </div>

        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Lab Hours/Wk</span>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '0.25rem', color: 'var(--accent-secondary)' }}>{labHours} hrs</div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>({labCredits} x {lMult})</span>
        </div>

        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Tutorial Hours/Wk</span>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '0.25rem' }}>{tutorialHours} hrs</div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>({tutorialCredits} x {tutMult})</span>
        </div>

        <div style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(6, 182, 212, 0.2))', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-accent)' }}>
          <span style={{ fontSize: '0.75rem', color: '#a5b4fc', fontWeight: 600 }}>TOTAL REQUIRED</span>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '0.25rem', color: '#fff' }}>{totalWeeklyHours} hrs/wk</div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Configured NEP Rule</span>
        </div>
      </div>
    </div>
  );
}
