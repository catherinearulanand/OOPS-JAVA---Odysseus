import React, { useState, useEffect } from 'react';
import { Clock, Info } from 'lucide-react';

export default function TimeslotManagementPage({ user }) {
  const [timeslots, setTimeslots] = useState([]);

  useEffect(() => {
    fetchTimeslots();
  }, []);

  const fetchTimeslots = async () => {
    try {
      const res = await fetch('/api/admin/timeslots', { headers: { 'Authorization': `Bearer ${user.token}` } });
      if (res.ok) setTimeslots(await res.json());
    } catch (e) { console.error(e); }
  };

  const mondaySlots = timeslots.filter(t => t.dayOfWeek === 'MONDAY');

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">College Timetable Timeslots</h1>
          <p className="page-subtitle">Exact 8-period daily schedule, morning break, and lunch configurations.</p>
        </div>
      </div>

      <div className="glass-panel alert alert-info" style={{ marginBottom: '1.5rem' }}>
        <Info size={20} />
        <div>
          <strong>Institutional Timetable Rules:</strong>
          <ul style={{ marginLeft: '1.25rem', marginTop: '0.4rem', fontSize: '0.85rem' }}>
            <li>Working Days: Monday – Friday (08:15 AM – 03:45 PM). Saturday/Sunday: Holidays.</li>
            <li>Morning periods (P1–P5) are 50 mins. Afternoon periods (P6–P8) are 45 mins.</li>
            <li>Morning Break: 09:55–10:10 AM (15 min). Lunch: 12:40–01:30 PM (50 min).</li>
            <li>Lab sessions require continuous blocks (2 or 3 periods) and <strong>must NOT cross Break or Lunch</strong>.</li>
          </ul>
        </div>
      </div>

      <div className="glass-panel">
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Daily Period Schedule</h3>
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Period</th>
                <th>Time Range</th>
                <th>Duration</th>
                <th>Type</th>
                <th>Lab Block Placement Validity</th>
              </tr>
            </thead>
            <tbody>
              {mondaySlots.map(t => {
                const isBreak = t.isBreak || t.periodLabel === 'BREAK';
                const isLunch = t.isLunch || t.periodLabel === 'LUNCH';
                const isSpecial = isBreak || isLunch;

                return (
                  <tr key={t.id} style={{ background: isSpecial ? 'rgba(245, 158, 11, 0.08)' : 'transparent' }}>
                    <td><strong>{t.periodLabel}</strong></td>
                    <td>{t.startTime} – {t.endTime}</td>
                    <td>{t.isBreak ? '15 mins' : t.periodNumber <= 5 ? '50 mins' : '45 mins'}</td>
                    <td>
                      {isBreak && <span className="badge badge-warning">Morning Break</span>}
                      {isLunch && <span className="badge badge-warning">Lunch Break</span>}
                      {!isSpecial && <span className="badge badge-success">Teaching Period</span>}
                    </td>
                    <td style={{ fontSize: '0.825rem', color: isSpecial ? 'var(--accent-danger)' : 'var(--text-muted)' }}>
                      {isSpecial ? 'NON-TEACHING (Labs cannot cross)' : 'Valid Teaching Period'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
