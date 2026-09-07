import React, { useState } from 'react';
import { PlayCircle, AlertCircle, CheckCircle2, ServerOff, FileCode } from 'lucide-react';

export default function GenerateTimetablePage({ user }) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showContractModal, setShowContractModal] = useState(false);
  const [contractPayload, setContractPayload] = useState(null);

  const handleGenerateClick = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/scheduler/generate', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      const data = await res.json();
      setResult({ status: res.status, data });
    } catch (e) {
      console.error(e);
      setResult({ status: 500, data: { message: 'Network connection error' } });
    } finally {
      setLoading(false);
    }
  };

  const handleInspectContract = async () => {
    try {
      const res = await fetch('/api/scheduler/input');
      if (res.ok) {
        setContractPayload(await res.json());
        setShowContractModal(true);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Generate Timetable — Integration Boundary</h1>
          <p className="page-subtitle">Handoff validated master data to Person B's scheduling solver interface.</p>
        </div>
      </div>

      <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem 2rem', marginBottom: '2rem' }}>
        <PlayCircle size={64} style={{ color: 'var(--accent-primary)', marginBottom: '1.25rem' }} />
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Trigger Timetable Scheduler</h2>
        <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0.75rem auto 2rem auto', fontSize: '0.925rem' }}>
          This button validates Person A's data layer readiness and invokes the scheduler service boundary (`/api/scheduler/generate`).
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <button className="btn btn-primary" style={{ padding: '0.9rem 2rem', fontSize: '1rem' }} onClick={handleGenerateClick} disabled={loading}>
            <PlayCircle size={20} /> {loading ? 'Validating & Invoking Boundary...' : 'Generate Timetable'}
          </button>

          <button className="btn btn-secondary" style={{ padding: '0.9rem 1.5rem' }} onClick={handleInspectContract}>
            <FileCode size={20} /> Inspect Scheduler JSON Contract
          </button>
        </div>
      </div>

      {/* Result Display */}
      {result && (
        <div>
          {result.data.status === 'SCHEDULER_NOT_CONNECTED' && (
            <div className="glass-panel" style={{ borderLeft: '4px solid var(--accent-warning)', padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <ServerOff size={36} style={{ color: 'var(--accent-warning)' }} />
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-warning)' }}>
                    Scheduler Service Not Connected Yet
                  </h3>
                  <p style={{ marginTop: '0.5rem', fontSize: '0.95rem' }}>
                    <strong>Message:</strong> {result.data.message}
                  </p>
                  <div style={{ marginTop: '1rem', background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: 'var(--radius-md)', fontSize: '0.85rem' }}>
                    <p style={{ color: '#818cf8', fontWeight: 600 }}>Person A Handoff Status: SUCCESS</p>
                    <ul style={{ marginLeft: '1.25rem', marginTop: '0.4rem', color: 'var(--text-muted)' }}>
                      <li>Data Readiness Validation: <strong>PASSED (0 errors)</strong></li>
                      <li>Scheduler JSON payload served at: <code>GET /api/scheduler/input</code></li>
                      <li>Zero fake or mock timetables were generated.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {result.data.status === 'VALIDATION_FAILED' && (
            <div className="glass-panel" style={{ borderLeft: '4px solid var(--accent-danger)', padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <AlertCircle size={36} style={{ color: 'var(--accent-danger)' }} />
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-danger)' }}>
                    Validation Errors Blocked Scheduler Invocation
                  </h3>
                  <p style={{ marginTop: '0.5rem', fontSize: '0.95rem' }}>{result.data.message}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Contract Inspection Modal */}
      {showContractModal && contractPayload && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '800px', maxHeight: '85vh', overflowY: 'auto', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>GET /api/scheduler/input Contract Payload</h2>
              <button className="btn btn-secondary" onClick={() => setShowContractModal(false)}>Close</button>
            </div>
            <pre style={{ background: 'rgba(0,0,0,0.6)', padding: '1.25rem', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', color: '#67e8f9', overflowX: 'auto' }}>
              {JSON.stringify(contractPayload, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
