import React, { useState, useEffect } from 'react';
import { DoorOpen, Plus, Edit2, Trash2 } from 'lucide-react';

export default function RoomManagementPage({ user }) {
  const [rooms, setRooms] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ roomCode: '', roomName: '', roomType: 'LECTURE_HALL', capacity: 60, department: 'CSE' });
  const [error, setError] = useState('');

  useEffect(() => { fetchRooms(); }, []);

  const fetchRooms = async () => {
    try {
      const res = await fetch('/api/admin/rooms', { headers: { 'Authorization': `Bearer ${user.token}` } });
      if (res.ok) setRooms(await res.json());
    } catch (e) { console.error(e); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const url = editId ? `/api/admin/rooms/${editId}` : '/api/admin/rooms';
    const method = editId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}` },
        body: JSON.stringify(form)
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to save room');
      }
      setShowModal(false);
      fetchRooms();
    } catch (err) { setError(err.message); }
  };

  const handleEdit = (r) => {
    setEditId(r.id);
    setForm({ roomCode: r.roomCode, roomName: r.roomName, roomType: r.roomType, capacity: r.capacity, department: r.department || 'CSE' });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Deactivate this room?')) return;
    try {
      await fetch(`/api/admin/rooms/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${user.token}` } });
      fetchRooms();
    } catch (e) { console.error(e); }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Room Master</h1>
          <p className="page-subtitle">Manage classroom facilities, lecture halls, and specialized laboratory rooms.</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setEditId(null); setForm({ roomCode: '', roomName: '', roomType: 'LECTURE_HALL', capacity: 60, department: 'CSE' }); setShowModal(true); }}>
          <Plus size={18} /> Add New Room
        </button>
      </div>

      <div className="glass-panel">
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Room Code</th>
                <th>Room Name</th>
                <th>Room Type</th>
                <th>Capacity</th>
                <th>Department</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map(r => (
                <tr key={r.id}>
                  <td><strong>{r.roomCode}</strong></td>
                  <td>{r.roomName}</td>
                  <td>
                    <span className={`badge ${r.roomType === 'LAB' ? 'badge-warning' : 'badge-success'}`}>
                      {r.roomType}
                    </span>
                  </td>
                  <td><strong>{r.capacity} seats</strong></td>
                  <td>{r.department}</td>
                  <td><span className={`badge ${r.active ? 'badge-success' : 'badge-danger'}`}>{r.active ? 'Active' : 'Inactive'}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn btn-secondary" style={{ padding: '0.4rem 0.6rem' }} onClick={() => handleEdit(r)}><Edit2 size={14} /></button>
                      <button className="btn btn-danger" style={{ padding: '0.4rem 0.6rem' }} onClick={() => handleDelete(r.id)}><Trash2 size={14} /></button>
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
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem' }}>{editId ? 'Edit Room' : 'Add New Room'}</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Room Code *</label>
                  <input type="text" className="form-input" value={form.roomCode} onChange={e => setForm({ ...form, roomCode: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Room Name *</label>
                  <input type="text" className="form-input" value={form.roomName} onChange={e => setForm({ ...form, roomName: e.target.value })} required />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Type *</label>
                  <select className="form-select" value={form.roomType} onChange={e => setForm({ ...form, roomType: e.target.value })}>
                    <option value="LECTURE_HALL">LECTURE_HALL</option>
                    <option value="LAB">LAB</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Capacity *</label>
                  <input type="number" className="form-input" value={form.capacity} onChange={e => setForm({ ...form, capacity: Number(e.target.value) })} min="1" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Dept</label>
                  <select className="form-select" value={form.department} onChange={e => setForm({ ...form, department: e.target.value })}>
                    <option value="CSE">CSE</option><option value="ECE">ECE</option><option value="EEE">EEE</option><option value="MECH">MECH</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', justifyRight: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Room</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
