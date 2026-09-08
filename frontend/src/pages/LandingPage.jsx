import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '1.5rem' }}>
      <div className="fade-in-up" style={{ textAlign: 'center', maxWidth: '620px' }}>
        <div className="brand-wordmark" style={{ fontSize: 'clamp(2.75rem, 8vw, 5rem)', lineHeight: 1 }}>
          Odysseus
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '1.25rem', maxWidth: '440px', marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6 }}>
          Smart classroom system for credit-based scheduling and lesson planning.
        </p>

        <div style={{ marginTop: '2.75rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem' }}>
          <button
            className="btn btn-hero"
            onClick={() => navigate('/login')}
            style={{ minWidth: '280px', justifyContent: 'center', padding: '1rem 1.75rem', fontSize: '0.95rem' }}
          >
            Enter as Admin <ArrowRight size={17} />
          </button>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', letterSpacing: '0.04em' }}>Admin Portal</span>
        </div>

        <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem' }}>
          <button
            className="btn btn-secondary"
            onClick={() => navigate('/login')}
            style={{ minWidth: '280px', justifyContent: 'center', padding: '1rem 1.75rem', fontSize: '0.95rem' }}
          >
            Faculty Portal
          </button>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', letterSpacing: '0.04em' }}>Lesson plans &amp; teaching schedule</span>
        </div>
      </div>
    </div>
  );
}
