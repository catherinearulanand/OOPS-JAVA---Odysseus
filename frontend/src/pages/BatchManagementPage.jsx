import React, { useState, useEffect } from 'react';
import { Layers, Plus, Edit2, Trash2 } from 'lucide-react';

export default function BatchManagementPage({ user }) {
  const [batches, setBatches] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ batchName: '', section: 'A', department: 'CSE', semester: 5, strength: 60, academicYear: '2026-2027' });

  useEffect(() => { fetchBatches(); }, []);

  const fetchBatches = async () => {
    try {
      const res = await fetch('/api/admin/batches', { headers: { 'Authorization': `Bearer ${user.token}` } });
      if (res.ok) setBatches(await res.json());
    } catch (e) { console.error(e); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editId ? `/api/admin/batches/${editId}` : '/api/admin/batches';
    const method = editId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}` },
        body: JSON.stringify(form)
      });
      if (res.ok) { setShowModal(false); fetchBatches(); }
    } catch (err) { console.error(err); }
  };

  const handleEdit = (b) => {
    setEditId(b.id);
    setForm({ batchName: b.batchName, section: b.section, department: b.department, semester: b.semester, strength: b.strength, academicYear: b.academicYear });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Deactivate batch?')) return;
    try {
      await fetch(`/api/admin/batches/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${user.token}` } });
      fetchBatches();
    } catch (e) { console.error(e); }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Batches & Sections</h1>
          <p className="page-subtitle">Manage student cohorts, sections, and class strength for timetable allocation.</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setEditId(null); setForm({ batchName: '', section: 'A', department: 'CSE', semester: 5, strength: 60, academicYear: '2026-2027' }); setShowModal(true); }}>
          <Plus size={18} /> Add Batch / Section
        </button>
      </div>

      <div className="glass-panel">
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Batch Name</th>
                <th>Section</th>
                <th>Department</th>
                <th>Semester</th>
                <th>Student Strength</th>
                <th>Academic Year</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {batches.map(b => (
                <tr key={b.id}>
                  <td><strong>{b.batchName}</strong></td>
                  <td><span className="badge badge-warning">Section {b.section}</span></td>
                  <td>{b.department}</td>
                  <td>Sem {b.semester}</td>
                  <td><strong>{b.strength} Students</strong></td>
                  <td>{b.academicYear}</td>
                  <td><span className={`badge ${b.active ? 'badge-success' : 'badge-danger'}`}>{b.active ? 'Active' : 'Inactive'}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn btn-secondary" style={{ padding: '0.4rem 0.6rem' }} onClick={() => handleEdit(b)}><Edit2 size={14} /></button>
                      <button className="btn btn-danger" style={{ padding: '0.4rem 0.6rem' }} onClick={() => handleDelete(b.id)}><Trash2 size={14} /></button>
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
          <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', padding: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem' }}>{editId ? 'Edit Batch' : 'Add New Batch'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Batch Name *</label>
                <input type="text" className="form-input" value={form.batchName} onChange={e => setForm({ ...form, batchName: e.target.value })} required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Section</label>
                  <input type="text" className="form-input" value={form.section} onChange={e => setForm({ ...form, section: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Department</label>
                  <select className="form-select" value={form.department} onChange={e => setForm({ ...form, department: e.target.value })}>
                    <option value="CSE">CSE</option><option value="ECE">ECE</option><option value="EEE">EEE</option><option value="MECH">MECH</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Semester</label>
                  <input type="number" className="form-input" value={form.semester} onChange={e => setForm({ ...form, semester: Number(e.target.value) })} min="1" max="8" required />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Strength *</label>
                  <input type="number" className="form-input" value={form.strength} onChange={e => setForm({ ...form, strength: Number(e.target.value) })} min="1" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Academic Year</label>
                  <input type="text" className="form-input" value={form.academicYear} onChange={e => setForm({ ...form, academicYear: e.target.value })} required />
                </div>
              </div>
              <div style={{ display: 'flex', justifyRight: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Batch</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
