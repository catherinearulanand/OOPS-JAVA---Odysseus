import React, { useState, useEffect } from 'react';
import { Sliders, Plus, Check } from 'lucide-react';

export default function NepRuleManagementPage({ user }) {
  const [rules, setRules] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    ruleName: '',
    academicYear: '2026-2027',
    program: 'B.Tech / Undergraduate',
    theoryHoursPerCredit: 1.0,
    labHoursPerCredit: 2.0,
    tutorialHoursPerCredit: 1.0,
    active: true
  });

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    try {
      const res = await fetch('/api/admin/nep-rules', {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      if (res.ok) setRules(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/nep-rules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        setShowModal(false);
        fetchRules();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">NEP Credit-to-Hours Rules</h1>
          <p className="page-subtitle">Configure institutional multipliers for calculating weekly teaching hours.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} /> Add New Rule
        </button>
      </div>

      <div className="glass-panel alert alert-info">
        <Sliders size={20} />
        <div>
          <strong>Configurable Multipliers:</strong> These credit rules dictate how course credits map to required weekly timetable hours. Changing the active rule automatically updates all subject weekly hour calculations across the system.
        </div>
      </div>

      <div className="glass-panel">
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Rule Name</th>
                <th>Academic Year</th>
                <th>Program</th>
                <th>Theory Multiplier</th>
                <th>Lab Multiplier</th>
                <th>Tutorial Multiplier</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rules.map(rule => (
                <tr key={rule.id}>
                  <td><strong>{rule.ruleName}</strong></td>
                  <td>{rule.academicYear}</td>
                  <td>{rule.program}</td>
                  <td>{rule.theoryHoursPerCredit} hrs / credit</td>
                  <td><strong style={{ color: 'var(--accent-secondary)' }}>{rule.labHoursPerCredit} hrs / credit</strong></td>
                  <td>{rule.tutorialHoursPerCredit} hrs / credit</td>
                  <td>
                    <span className={`badge ${rule.active ? 'badge-success' : 'badge-danger'}`}>
                      {rule.active ? 'Active Rule' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', padding: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem' }}>Add Credit Conversion Rule</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Rule Name *</label>
                <input type="text" className="form-input" value={form.ruleName} onChange={e => setForm({ ...form, ruleName: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Academic Year</label>
                <input type="text" className="form-input" value={form.academicYear} onChange={e => setForm({ ...form, academicYear: e.target.value })} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Theory Mult</label>
                  <input type="number" step="0.5" className="form-input" value={form.theoryHoursPerCredit} onChange={e => setForm({ ...form, theoryHoursPerCredit: parseFloat(e.target.value) })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Lab Mult</label>
                  <input type="number" step="0.5" className="form-input" value={form.labHoursPerCredit} onChange={e => setForm({ ...form, labHoursPerCredit: parseFloat(e.target.value) })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Tutorial Mult</label>
                  <input type="number" step="0.5" className="form-input" value={form.tutorialHoursPerCredit} onChange={e => setForm({ ...form, tutorialHoursPerCredit: parseFloat(e.target.value) })} required />
                </div>
              </div>
              <div style={{ display: 'flex', justifyRight: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save & Activate</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
