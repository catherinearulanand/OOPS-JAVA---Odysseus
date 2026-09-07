import React, { useState, useEffect } from 'react';
import LiveCreditCalculator from '../components/LiveCreditCalculator';
import { Plus, Edit2, Trash2, BookOpen } from 'lucide-react';

export default function SubjectManagementPage({ user }) {
  const [subjects, setSubjects] = useState([]);
  const [activeRule, setActiveRule] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    subjectCode: '',
    subjectName: '',
    department: 'CSE',
    semester: 5,
    subjectType: 'THEORY',
    theoryCredits: 3,
    labCredits: 0,
    tutorialCredits: 0,
    requiresLab: false,
    labDuration: 2
  });

  const [error, setError] = useState('');

  useEffect(() => {
    fetchSubjects();
    fetchActiveRule();
  }, []);

  const fetchSubjects = async () => {
    try {
      const res = await fetch('/api/admin/subjects', {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      if (res.ok) setSubjects(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  const fetchActiveRule = async () => {
    try {
      const res = await fetch('/api/admin/nep-rules', {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      if (res.ok) {
        const rules = await res.json();
        const active = rules.find(r => r.active);
        setActiveRule(active || null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const url = editId ? `/api/admin/subjects/${editId}` : '/api/admin/subjects';
    const method = editId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(form)
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to save subject');
      }

      setShowModal(false);
      resetForm();
      fetchSubjects();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (sub) => {
    setEditId(sub.id);
    setForm({
      subjectCode: sub.subjectCode,
      subjectName: sub.subjectName,
      department: sub.department,
      semester: sub.semester || 5,
      subjectType: sub.subjectType,
      theoryCredits: sub.theoryCredits,
      labCredits: sub.labCredits,
      tutorialCredits: sub.tutorialCredits,
      requiresLab: sub.requiresLab,
      labDuration: sub.labDuration || 2
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to deactivate this subject?')) return;
    try {
      await fetch(`/api/admin/subjects/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      fetchSubjects();
    } catch (e) {
      console.error(e);
    }
  };

  const resetForm = () => {
    setEditId(null);
    setForm({
      subjectCode: '',
      subjectName: '',
      department: 'CSE',
      semester: 5,
      subjectType: 'THEORY',
      theoryCredits: 3,
      labCredits: 0,
      tutorialCredits: 0,
      requiresLab: false,
      labDuration: 2
    });
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Subjects & Credit Management</h1>
          <p className="page-subtitle">Manage courses, credits, and live weekly-hour requirements.</p>
        </div>
        <button className="btn btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
          <Plus size={18} /> Add New Subject
        </button>
      </div>

      <div className="glass-panel" style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>Active NEP Credit Conversion Rule</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Current Institutional Multipliers: <strong>Theory: {activeRule?.theoryHoursPerCredit || 1}x</strong> | <strong>Lab: {activeRule?.labHoursPerCredit || 2}x</strong> | <strong>Tutorial: {activeRule?.tutorialHoursPerCredit || 1}x</strong>
        </p>
      </div>

      {/* Subjects Table */}
      <div className="glass-panel">
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Subject Name</th>
                <th>Dept / Sem</th>
                <th>Type</th>
                <th>Credits (T/L/Tut)</th>
                <th>Weekly Hours</th>
                <th>Lab Session</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map(sub => (
                <tr key={sub.id}>
                  <td><strong>{sub.subjectCode}</strong></td>
                  <td>{sub.subjectName}</td>
                  <td>{sub.department} - Sem {sub.semester}</td>
                  <td><span className="badge badge-warning">{sub.subjectType}</span></td>
                  <td>{sub.theoryCredits} / {sub.labCredits} / {sub.tutorialCredits}</td>
                  <td><strong style={{ color: 'var(--accent-primary)' }}>{sub.calculatedWeeklyHours} hrs/wk</strong></td>
                  <td>{sub.requiresLab ? `${sub.labDuration} Periods` : 'N/A'}</td>
                  <td>
                    <span className={`badge ${sub.active ? 'badge-success' : 'badge-danger'}`}>
                      {sub.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn btn-secondary" style={{ padding: '0.4rem 0.6rem' }} onClick={() => handleEdit(sub)}>
                        <Edit2 size={14} />
                      </button>
                      <button className="btn btn-danger" style={{ padding: '0.4rem 0.6rem' }} onClick={() => handleDelete(sub.id)}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {subjects.length === 0 && (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                    No subjects added yet. Click "Add New Subject" to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '650px', maxHeight: '90vh', overflowY: 'auto', padding: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem' }}>
              {editId ? 'Edit Subject' : 'Add New Subject'}
            </h2>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Subject Code *</label>
                  <input type="text" className="form-input" value={form.subjectCode} onChange={e => setForm({ ...form, subjectCode: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Subject Name *</label>
                  <input type="text" className="form-input" value={form.subjectName} onChange={e => setForm({ ...form, subjectName: e.target.value })} required />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Department *</label>
                  <select className="form-select" value={form.department} onChange={e => setForm({ ...form, department: e.target.value })}>
                    <option value="CSE">CSE</option>
                    <option value="ECE">ECE</option>
                    <option value="EEE">EEE</option>
                    <option value="MECH">MECH</option>
                    <option value="CIVIL">CIVIL</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Semester *</label>
                  <input type="number" className="form-input" value={form.semester} onChange={e => setForm({ ...form, semester: Number(e.target.value) })} min="1" max="8" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Subject Type *</label>
                  <select className="form-select" value={form.subjectType} onChange={e => setForm({ ...form, subjectType: e.target.value })}>
                    <option value="THEORY">THEORY</option>
                    <option value="LAB">LAB</option>
                    <option value="TUTORIAL">TUTORIAL</option>
                    <option value="THEORY_AND_LAB">THEORY_AND_LAB</option>
                  </select>
                </div>
              </div>

              {/* Credits Entry */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Theory Credits</label>
                  <input type="number" step="0.5" className="form-input" value={form.theoryCredits} onChange={e => setForm({ ...form, theoryCredits: parseFloat(e.target.value) || 0 })} min="0" />
                </div>
                <div className="form-group">
                  <label className="form-label">Lab Credits</label>
                  <input type="number" step="0.5" className="form-input" value={form.labCredits} onChange={e => {
                    const lCred = parseFloat(e.target.value) || 0;
                    setForm({ ...form, labCredits: lCred, requiresLab: lCred > 0 });
                  }} min="0" />
                </div>
                <div className="form-group">
                  <label className="form-label">Tutorial Credits</label>
                  <input type="number" step="0.5" className="form-input" value={form.tutorialCredits} onChange={e => setForm({ ...form, tutorialCredits: parseFloat(e.target.value) || 0 })} min="0" />
                </div>
              </div>

              {/* Live Preview */}
              <div style={{ marginBottom: '1.5rem' }}>
                <LiveCreditCalculator
                  theoryCredits={form.theoryCredits}
                  labCredits={form.labCredits}
                  tutorialCredits={form.tutorialCredits}
                  activeRule={activeRule}
                />
              </div>

              {form.requiresLab && (
                <div className="form-group glass-panel" style={{ background: 'rgba(245, 158, 11, 0.05)', borderColor: 'rgba(245, 158, 11, 0.3)' }}>
                  <label className="form-label">Required Lab Continuous Periods</label>
                  <select className="form-select" value={form.labDuration} onChange={e => setForm({ ...form, labDuration: Number(e.target.value) })}>
                    <option value={2}>2 Continuous Periods (e.g. P1+P2, P3+P4)</option>
                    <option value={3}>3 Continuous Periods (e.g. P3+P4+P5)</option>
                  </select>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                    Note: Lab blocks cannot cross Morning Break (09:55–10:10) or Lunch (12:40–13:30).
                  </p>
                </div>
              )}

              <div style={{ display: 'flex', justifyRight: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editId ? 'Save Changes' : 'Create Subject'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
