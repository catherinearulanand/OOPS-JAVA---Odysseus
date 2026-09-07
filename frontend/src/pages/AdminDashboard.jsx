import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, Users, DoorOpen, Layers, BookMarked, 
  Calendar, CheckCircle2, PlayCircle, Sliders, Clock, ArrowRight 
} from 'lucide-react';

export default function AdminDashboard({ user }) {
  const [stats, setStats] = useState({
    subjects: 0,
    faculty: 0,
    rooms: 0,
    batches: 0,
    offerings: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const headers = { 'Authorization': `Bearer ${user?.token}` };
      const [sRes, fRes, rRes, bRes, oRes] = await Promise.all([
        fetch('/api/admin/subjects', { headers }),
        fetch('/api/admin/faculty', { headers }),
        fetch('/api/admin/rooms', { headers }),
        fetch('/api/admin/batches', { headers }),
        fetch('/api/admin/offerings', { headers })
      ]);

      const [s, f, r, b, o] = await Promise.all([
        sRes.ok ? sRes.json() : [],
        fRes.ok ? fRes.json() : [],
        rRes.ok ? rRes.json() : [],
        bRes.ok ? bRes.json() : [],
        oRes.ok ? oRes.json() : []
      ]);

      setStats({
        subjects: s.length,
        faculty: f.length,
        rooms: r.length,
        batches: b.length,
        offerings: o.length
      });
    } catch (err) {
      console.error("Failed to fetch dashboard stats", err);
    }
  };

  const workflowSteps = [
    { title: '1. Configure NEP Rules', icon: Sliders, path: '/nep-rules', desc: 'Set credit-to-hours conversion multipliers' },
    { title: '2. Subjects & Credits', icon: BookOpen, path: '/subjects', desc: 'Enter theory/lab credits and calculated weekly hours' },
    { title: '3. Faculty Master', icon: Users, path: '/faculty', desc: 'Manage faculty, max workload, and subject eligibility' },
    { title: '4. Room Master', icon: DoorOpen, path: '/rooms', desc: 'Configure lecture halls and specialized labs' },
    { title: '5. Batches & Sections', icon: Layers, path: '/batches', desc: 'Define student sections and capacity' },
    { title: '6. Subject Offerings', icon: BookMarked, path: '/offerings', desc: 'Map subjects to batches and assign faculty' },
    { title: '7. Academic Calendar', icon: Calendar, path: '/calendar', desc: 'Configure term dates, Saturdays, and holidays' },
    { title: '8. Timetable Timeslots', icon: Clock, path: '/timeslots', desc: 'View college 8-period schedule & break rules' },
    { title: '9. Data Readiness Check', icon: CheckCircle2, path: '/readiness', desc: 'Validate complete data prior to scheduler handoff' },
    { title: '10. Generate Timetable', icon: PlayCircle, path: '/generate', desc: 'Trigger scheduler boundary interface' }
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="page-subtitle">Welcome back, {user?.fullName || user?.username}. Manage master data and scheduler input.</p>
        </div>
        <Link to="/readiness" className="btn btn-primary">
          <CheckCircle2 size={18} /> Run Readiness Check
        </Link>
      </div>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem', marginBottom: '2.5rem' }}>
        <div className="glass-panel" style={{ textAlign: 'center' }}>
          <BookOpen size={24} style={{ color: 'var(--accent-primary)', marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{stats.subjects}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Subjects</div>
        </div>

        <div className="glass-panel" style={{ textAlign: 'center' }}>
          <Users size={24} style={{ color: 'var(--accent-secondary)', marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{stats.faculty}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Faculty Members</div>
        </div>

        <div className="glass-panel" style={{ textAlign: 'center' }}>
          <DoorOpen size={24} style={{ color: 'var(--accent-success)', marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{stats.rooms}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Rooms & Labs</div>
        </div>

        <div className="glass-panel" style={{ textAlign: 'center' }}>
          <Layers size={24} style={{ color: 'var(--accent-warning)', marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{stats.batches}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Batches / Sections</div>
        </div>

        <div className="glass-panel" style={{ textAlign: 'center' }}>
          <BookMarked size={24} style={{ color: '#a855f7', marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{stats.offerings}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Active Offerings</div>
        </div>
      </div>

      {/* Workflow Navigation Cards */}
      <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem' }}>
        Person A — Recommended Data Setup Workflow
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem' }}>
        {workflowSteps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <Link key={idx} to={step.path} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'rgba(99, 102, 241, 0.15)', color: 'var(--accent-primary)' }}>
                    <Icon size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>{step.title}</h3>
                    <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{step.desc}</p>
                  </div>
                </div>
                <ArrowRight size={18} style={{ color: 'var(--text-dim)' }} />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
