import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, BookOpen, Users, DoorOpen, Layers, 
  BookMarked, Calendar, Clock, Sliders, CheckCircle2, PlayCircle, LogOut 
} from 'lucide-react';

export default function Sidebar({ user, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="brand-header">
        <div className="brand-logo">O</div>
        <div>
          <h1 className="brand-title">ODYSSEUS</h1>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', letterSpacing: '0.05em' }}>
            ADMIN & DATA LAYER
          </span>
        </div>
      </div>

      <nav className="nav-group">
        <NavLink to="/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <LayoutDashboard size={18} /> Dashboard
        </NavLink>
        <NavLink to="/nep-rules" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Sliders size={18} /> NEP Credit Rules
        </NavLink>
        <NavLink to="/subjects" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <BookOpen size={18} /> Subjects & Credits
        </NavLink>
        <NavLink to="/faculty" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Users size={18} /> Faculty Master
        </NavLink>
        <NavLink to="/rooms" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <DoorOpen size={18} /> Room Master
        </NavLink>
        <NavLink to="/batches" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Layers size={18} /> Batches & Sections
        </NavLink>
        <NavLink to="/offerings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <BookMarked size={18} /> Subject Offerings
        </NavLink>
        <NavLink to="/calendar" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Calendar size={18} /> Academic Calendar
        </NavLink>
        <NavLink to="/timeslots" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Clock size={18} /> Timetable Timeslots
        </NavLink>
        <NavLink to="/readiness" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <CheckCircle2 size={18} /> Data Readiness Check
        </NavLink>
        <NavLink to="/generate" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <PlayCircle size={18} /> Generate Timetable
        </NavLink>
      </nav>

      <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
        <div style={{ marginBottom: '0.75rem', padding: '0 0.5rem' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user?.fullName || user?.username}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--accent-primary)' }}>{user?.role}</div>
        </div>
        <button onClick={handleLogout} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </aside>
  );
}
