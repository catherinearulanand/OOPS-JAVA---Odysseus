import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertTriangle, RefreshCw, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DataReadinessPage({ user }) {
  const [readiness, setReadiness] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    runCheck();
  }, []);

  const runCheck = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/readiness', {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      if (res.ok) {
        setReadiness(await res.json());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Data Readiness & Validation Check</h1>
          <p className="page-subtitle">Inspect master data completeness and rule consistency before scheduler handoff.</p>
        </div>
        <button className="btn btn-primary" onClick={runCheck} disabled={loading}>
          <RefreshCw size={18} className={loading ? 'spin' : ''} /> {loading ? 'Checking...' : 'Re-run Readiness Check'}
        </button>
      </div>

      {readiness && (
        <div>
          {/* Status Banner */}
          <div className={`alert ${readiness.ready ? 'alert-success' : 'alert-danger'}`} style={{ padding: '1.5rem', marginBottom: '2rem' }}>
            {readiness.ready ? <CheckCircle2 size={32} /> : <AlertTriangle size={32} />}
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                {readiness.ready ? 'DATA READY FOR SCHEDULER' : 'DATA READINESS VALIDATION FAILED'}
              </h2>
              <p style={{ marginTop: '0.4rem', fontSize: '0.95rem' }}>{readiness.summaryMessage}</p>
            </div>
          </div>

          {/* Actionable Issues List */}
          {!readiness.ready && (
            <div className="glass-panel" style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--accent-danger)' }}>
                Actionable Issues Found ({readiness.issueCount})
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {readiness.issues.map((issue, idx) => (
                  <div key={idx} style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '0.85rem 1.1rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem' }}>
                    <span style={{ color: 'var(--accent-danger)', fontWeight: 700 }}>{idx + 1}.</span>
                    <span>{issue}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {readiness.ready && (
            <div className="glass-panel" style={{ textAlign: 'center', padding: '2.5rem' }}>
              <CheckCircle2 size={48} style={{ color: 'var(--accent-success)', marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>All Validation Checks Passed!</h3>
              <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', marginBottom: '1.5rem' }}>
                Subjects, faculty, workload limits, room capacities, batch offerings, academic calendar, and period timeslots are fully validated.
              </p>
              <Link to="/generate" className="btn btn-primary" style={{ display: 'inline-flex' }}>
                Proceed to Generate Timetable <ArrowRight size={18} />
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
