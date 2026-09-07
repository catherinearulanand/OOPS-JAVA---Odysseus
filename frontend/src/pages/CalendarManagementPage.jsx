import React, { useState, useEffect } from 'react';
import { Calendar, Plus } from 'lucide-react';

export default function CalendarManagementPage({ user }) {
  const [calendars, setCalendars] = useState([]);
  const [showHolidayModal, setShowHolidayModal] = useState(false);
  const [holidayForm, setHolidayForm] = useState({ holidayDate: '', name: '', type: 'GOVERNMENT', description: '' });
  const [activeCalId, setActiveCalId] = useState(null);

  useEffect(() => { fetchCalendars(); }, []);

  const fetchCalendars = async () => {
    try {
      const res = await fetch('/api/admin/calendar', { headers: { 'Authorization': `Bearer ${user.token}` } });
      if (res.ok) {
        const data = await res.json();
        setCalendars(data);
        if (data.length > 0) setActiveCalId(data[0].id);
      }
    } catch (e) { console.error(e); }
  };

  const handleAddHoliday = async (e) => {
    e.preventDefault();
    if (!activeCalId) return;
    try {
      const res = await fetch(`/api/admin/calendar/${activeCalId}/holidays`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}` },
        body: JSON.stringify(holidayForm)
      });
      if (res.ok) {
        setShowHolidayModal(false);
        fetchCalendars();
      }
    } catch (e) { console.error(e); }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Academic Calendar & Holidays</h1>
          <p className="page-subtitle">Configure term dates, Saturday/Sunday working rules, and institutional holidays.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowHolidayModal(true)}>
          <Plus size={18} /> Add Holiday
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem' }}>
        <div className="glass-panel">
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Active Term Calendar</h3>
          {calendars.map(cal => (
            <div key={cal.id} style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
              <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>AY {cal.academicYear} (Sem {cal.semester})</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                Dates: {cal.startDate} to {cal.endDate}
              </div>
              <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span className="badge badge-warning">Saturday: {cal.saturdayRule}</span>
                <span className="badge badge-warning">Sunday: {cal.sundayRule}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="glass-panel">
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Government & College Holidays</h3>
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Holiday Name</th>
                  <th>Type</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {calendars.flatMap(c => c.holidays || []).map(h => (
                  <tr key={h.id}>
                    <td><strong>{h.holidayDate}</strong></td>
                    <td>{h.name}</td>
                    <td>
                      <span className={`badge ${h.type === 'GOVERNMENT' ? 'badge-danger' : 'badge-warning'}`}>
                        {h.type}
                      </span>
                    </td>
                    <td>{h.description || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showHolidayModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', padding: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem' }}>Add Holiday Record</h2>
            <form onSubmit={handleAddHoliday}>
              <div className="form-group">
                <label className="form-label">Holiday Date *</label>
                <input type="date" className="form-input" value={holidayForm.holidayDate} onChange={e => setHolidayForm({ ...holidayForm, holidayDate: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Holiday Name *</label>
                <input type="text" className="form-input" value={holidayForm.name} onChange={e => setHolidayForm({ ...holidayForm, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Type *</label>
                <select className="form-select" value={holidayForm.type} onChange={e => setHolidayForm({ ...holidayForm, type: e.target.value })}>
                  <option value="GOVERNMENT">GOVERNMENT</option>
                  <option value="COLLEGE">COLLEGE</option>
                  <option value="OTHER">OTHER</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <input type="text" className="form-input" value={holidayForm.description} onChange={e => setHolidayForm({ ...holidayForm, description: e.target.value })} />
              </div>
              <div style={{ display: 'flex', justifyRight: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowHolidayModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Holiday</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
