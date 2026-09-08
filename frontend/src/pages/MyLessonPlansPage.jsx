import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookMarked, ArrowRight, AlertCircle, CalendarDays } from 'lucide-react';

export default function MyLessonPlansPage({ user }) {
  const [plans, setPlans] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchMyPlans(); }, []);

  const fetchMyPlans = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/lesson-plan/my-plans', {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      const data = await res.json().catch(() => ([]));
      if (!res.ok) {
        throw new Error(data.error || 'Failed to load your lesson plans.');
      }
      setPlans(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">My Lesson Plans</h1>
          <p className="page-subtitle">Subject offerings assigned to you, with a generated day-by-day teaching plan.</p>
        </div>
      </div>

      {loading && <p style={{ color: 'var(--text-muted)' }}>Loading…</p>}

      {error && (
        <div className="alert alert-danger">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {!loading && !error && plans.length === 0 && (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
          <BookMarked size={40} style={{ color: 'var(--text-dim)', marginBottom: '1rem' }} />
          <h3 style={{ fontWeight: 700 }}>No lesson plans yet</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', fontSize: '0.9rem' }}>
            An admin generates a lesson plan for each of your subject offerings once its syllabus is entered.
            Nothing will appear here until that has happened for at least one of your subjects.
          </p>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {plans.map(plan => (
          <div key={plan.id} className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>
                {plan.subjectOffering?.subject?.subjectCode} — {plan.subjectOffering?.subject?.subjectName}
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                {plan.subjectOffering?.batch?.batchName} · {plan.subjectOffering?.academicYear} Sem {plan.subjectOffering?.semester}
              </p>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CalendarDays size={14} />
              Calendar: {plan.academicCalendar?.startDate} to {plan.academicCalendar?.endDate}
            </div>
            <Link
              to={`/lesson-plan?offeringId=${plan.subjectOffering?.id}&academicCalendarId=${plan.academicCalendar?.id}`}
              className="btn btn-primary"
              style={{ justifyContent: 'center', marginTop: '0.5rem' }}
            >
              View Day-by-Day Plan <ArrowRight size={16} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
