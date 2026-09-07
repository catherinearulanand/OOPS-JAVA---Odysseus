import React, { useState, useEffect } from 'react';
import { BookMarked, Plus, Trash2 } from 'lucide-react';

export default function OfferingManagementPage({ user }) {
  const [offerings, setOfferings] = useState([]);
  const [batches, setBatches] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [faculty, setFaculty] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ batchId: '', subjectId: '', assignedFacultyId: '', academicYear: '2026-2027' });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const headers = { 'Authorization': `Bearer ${user.token}` };
      const [oRes, bRes, sRes, fRes] = await Promise.all([
        fetch('/api/admin/offerings', { headers }),
        fetch('/api/admin/batches', { headers }),
        fetch('/api/admin/subjects', { headers }),
        fetch('/api/admin/faculty', { headers })
      ]);

      if (oRes.ok) setOfferings(await oRes.json());
      if (bRes.ok) setBatches(await bRes.json());
      if (sRes.ok) setSubjects(await sRes.json());
      if (fRes.ok) setFaculty(await fRes.json());
    } catch (e) { console.error(e); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/admin/offerings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}` },
        body: JSON.stringify(form)
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to create offering');
      }
      setShowModal(false);
      fetchData();
    } catch (err) { setError(err.message); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this subject offering?')) return;
    try {
      await fetch(`/api/admin/offerings/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${user.token}` } });
      fetchData();
    } catch (e) { console.error(e); }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Subject Offerings</h1>
          <p className="page-subtitle">Map subjects to student batches and assign qualified faculty members.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} /> Assign Subject to Batch
        </button>
      </div>

      <div className="glass-panel">
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Batch / Section</th>
                <th>Subject Code & Name</th>
                <th>Calculated Weekly Hours</th>
                <th>Assigned Faculty</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {offerings.map(o => (
                <tr key={o.id}>
                  <td><strong>{o.batch?.batchName}</strong> (Sem {o.batch?.semester})</td>
                  <td><strong>{o.subject?.subjectCode}</strong> — {o.subject?.subjectName}</td>
                  <td><strong style={{ color: 'var(--accent-primary)' }}>{o.subject?.calculatedWeeklyHours} hrs/wk</strong></td>
                  <td>
                    {o.assignedFaculty ? (
                      <span>{o.assignedFaculty.name} ({o.assignedFaculty.employeeId})</span>
                    ) : (
                      <span className="badge badge-warning">Unassigned</span>
                    )}
                  </td>
                  <td><span className={`badge ${o.active ? 'badge-success' : 'badge-danger'}`}>{o.active ? 'Active' : 'Inactive'}</span></td>
                  <td>
                    <button className="btn btn-danger" style={{ padding: '0.4rem 0.6rem' }} onClick={() => handleDelete(o.id)}>
                      <Trash2 size={14} />
                    </button>
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
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem' }}>Create Subject Offering</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Target Batch / Section *</label>
                <select className="form-select" value={form.batchId} onChange={e => setForm({ ...form, batchId: e.target.value })} required>
                  <option value="">-- Select Batch --</option>
                  {batches.map(b => <option key={b.id} value={b.id}>{b.batchName} ({b.department} Sem {b.semester})</option>)}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Subject *</label>
                <select className="form-select" value={form.subjectId} onChange={e => setForm({ ...form, subjectId: e.target.value })} required>
                  <option value="">-- Select Subject --</option>
                  {subjects.map(s => <option key={s.id} value={s.id}>{s.subjectCode} - {s.subjectName} ({s.calculatedWeeklyHours} hrs/wk)</option>)}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Assigned Faculty (Optional)</label>
                <select className="form-select" value={form.assignedFacultyId} onChange={e => setForm({ ...form, assignedFacultyId: e.target.value })}>
                  <option value="">-- Auto-select from eligible faculty --</option>
                  {faculty.map(f => <option key={f.id} value={f.id}>{f.name} ({f.employeeId})</option>)}
                </select>
              </div>

              <div style={{ display: 'flex', justifyRight: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Offering</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
