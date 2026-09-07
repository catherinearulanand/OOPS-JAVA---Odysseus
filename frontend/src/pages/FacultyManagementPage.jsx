import React, { useState, useEffect } from 'react';
import { Users, Plus, Edit2, Trash2 } from 'lucide-react';

export default function FacultyManagementPage({ user }) {
  const [faculty, setFaculty] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    employeeId: '',
    name: '',
    email: '',
    department: 'CSE',
    maxWeeklyLoad: 18,
    subjectIds: []
  });

  const [error, setError] = useState('');

  useEffect(() => {
    fetchFaculty();
    fetchSubjects();
  }, []);

  const fetchFaculty = async () => {
    try {
      const res = await fetch('/api/admin/faculty', { headers: { 'Authorization': `Bearer ${user.token}` } });
      if (res.ok) setFaculty(await res.json());
    } catch (e) { console.error(e); }
  };

  const fetchSubjects = async () => {
    try {
      const res = await fetch('/api/admin/subjects', { headers: { 'Authorization': `Bearer ${user.token}` } });
      if (res.ok) setSubjects(await res.json());
    } catch (e) { console.error(e); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const url = editId ? `/api/admin/faculty/${editId}` : '/api/admin/faculty';
    const method = editId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}` },
        body: JSON.stringify(form)
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to save faculty');
      }
      setShowModal(false);
      fetchFaculty();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubjectToggle = (sId) => {
    setForm(prev => {
      const exists = prev.subjectIds.includes(sId);
      return {
        ...prev,
        subjectIds: exists ? prev.subjectIds.filter(id => id !== sId) : [...prev.subjectIds, sId]
      };
    });
  };

  const handleEdit = (f) => {
    setEditId(f.id);
    setForm({
      employeeId: f.employeeId,
      name: f.name,
      email: f.email,
      department: f.department,
      maxWeeklyLoad: f.maxWeeklyLoad,
      subjectIds: f.eligibleSubjects ? f.eligibleSubjects.map(s => s.id) : []
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Deactivate this faculty member?')) return;
    try {
      await fetch(`/api/admin/faculty/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${user.token}` } });
      fetchFaculty();
    } catch (e) { console.error(e); }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Faculty Master</h1>
          <p className="page-subtitle">Manage faculty profiles, maximum weekly load, and subject teaching eligibility.</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setEditId(null); setForm({ employeeId: '', name: '', email: '', department: 'CSE', maxWeeklyLoad: 18, subjectIds: [] }); setShowModal(true); }}>
          <Plus size={18} /> Add Faculty Member
        </button>
      </div>

      <div className="glass-panel">
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Emp ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Dept</th>
                <th>Max Load</th>
                <th>Eligible Teaching Subjects</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {faculty.map(f => (
                <tr key={f.id}>
                  <td><strong>{f.employeeId}</strong></td>
                  <td>{f.name}</td>
                  <td>{f.email}</td>
                  <td>{f.department}</td>
                  <td><strong style={{ color: 'var(--accent-secondary)' }}>{f.maxWeeklyLoad} hrs/wk</strong></td>
                  <td>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                      {f.eligibleSubjects && f.eligibleSubjects.map(s => (
                        <span key={s.id} className="badge badge-warning" style={{ fontSize: '0.7rem' }}>
                          {s.subjectCode}
                        </span>
                      ))}
                      {(!f.eligibleSubjects || f.eligibleSubjects.length === 0) && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--accent-danger)' }}>No subjects assigned</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${f.active ? 'badge-success' : 'badge-danger'}`}>
                      {f.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn btn-secondary" style={{ padding: '0.4rem 0.6rem' }} onClick={() => handleEdit(f)}><Edit2 size={14} /></button>
                      <button className="btn btn-danger" style={{ padding: '0.4rem 0.6rem' }} onClick={() => handleDelete(f.id)}><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', padding: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem' }}>{editId ? 'Edit Faculty' : 'Add Faculty Member'}</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Employee ID *</label>
                  <input type="text" className="form-input" value={form.employeeId} onChange={e => setForm({ ...form, employeeId: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input type="text" className="form-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Email *</label>
                  <input type="email" className="form-input" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Department *</label>
                  <select className="form-select" value={form.department} onChange={e => setForm({ ...form, department: e.target.value })}>
                    <option value="CSE">CSE</option><option value="ECE">ECE</option><option value="EEE">EEE</option><option value="MECH">MECH</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Max Load (hrs)</label>
                  <input type="number" className="form-input" value={form.maxWeeklyLoad} onChange={e => setForm({ ...form, maxWeeklyLoad: Number(e.target.value) })} min="1" max="40" required />
                </div>
              </div>

              <div className="form-group" style={{ marginTop: '1rem' }}>
                <label className="form-label">Subject Teaching Eligibility</label>
                <div className="glass-panel" style={{ maxHeight: '180px', overflowY: 'auto', padding: '0.75rem', background: 'rgba(0,0,0,0.3)' }}>
                  {subjects.map(s => (
                    <label key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                      <input type="checkbox" checked={form.subjectIds.includes(s.id)} onChange={() => handleSubjectToggle(s.id)} />
                      <span><strong>{s.subjectCode}</strong> — {s.subjectName} ({s.subjectType})</span>
                    </label>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyRight: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Faculty</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
