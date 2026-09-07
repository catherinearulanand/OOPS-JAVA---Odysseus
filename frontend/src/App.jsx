import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';

import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import SubjectManagementPage from './pages/SubjectManagementPage';
import NepRuleManagementPage from './pages/NepRuleManagementPage';
import FacultyManagementPage from './pages/FacultyManagementPage';
import RoomManagementPage from './pages/RoomManagementPage';
import BatchManagementPage from './pages/BatchManagementPage';
import OfferingManagementPage from './pages/OfferingManagementPage';
import CalendarManagementPage from './pages/CalendarManagementPage';
import TimeslotManagementPage from './pages/TimeslotManagementPage';
import DataReadinessPage from './pages/DataReadinessPage';
import GenerateTimetablePage from './pages/GenerateTimetablePage';

export default function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('odysseus_user');
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('odysseus_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('odysseus_user');
  };

  return (
    <Router>
      <div className="app-container">
        {user && <Sidebar user={user} onLogout={handleLogout} />}

        <main className={user ? "main-content" : ""} style={!user ? { width: '100%' } : {}}>
          <Routes>
            <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />

            <Route path="/dashboard" element={
              <ProtectedRoute user={user} requiredRole="ROLE_ADMIN">
                <AdminDashboard user={user} />
              </ProtectedRoute>
            } />

            <Route path="/subjects" element={
              <ProtectedRoute user={user} requiredRole="ROLE_ADMIN">
                <SubjectManagementPage user={user} />
              </ProtectedRoute>
            } />

            <Route path="/nep-rules" element={
              <ProtectedRoute user={user} requiredRole="ROLE_ADMIN">
                <NepRuleManagementPage user={user} />
              </ProtectedRoute>
            } />

            <Route path="/faculty" element={
              <ProtectedRoute user={user} requiredRole="ROLE_ADMIN">
                <FacultyManagementPage user={user} />
              </ProtectedRoute>
            } />

            <Route path="/rooms" element={
              <ProtectedRoute user={user} requiredRole="ROLE_ADMIN">
                <RoomManagementPage user={user} />
              </ProtectedRoute>
            } />

            <Route path="/batches" element={
              <ProtectedRoute user={user} requiredRole="ROLE_ADMIN">
                <BatchManagementPage user={user} />
              </ProtectedRoute>
            } />

            <Route path="/offerings" element={
              <ProtectedRoute user={user} requiredRole="ROLE_ADMIN">
                <OfferingManagementPage user={user} />
              </ProtectedRoute>
            } />

            <Route path="/calendar" element={
              <ProtectedRoute user={user} requiredRole="ROLE_ADMIN">
                <CalendarManagementPage user={user} />
              </ProtectedRoute>
            } />

            <Route path="/timeslots" element={
              <ProtectedRoute user={user} requiredRole="ROLE_ADMIN">
                <TimeslotManagementPage user={user} />
              </ProtectedRoute>
            } />

            <Route path="/readiness" element={
              <ProtectedRoute user={user} requiredRole="ROLE_ADMIN">
                <DataReadinessPage user={user} />
              </ProtectedRoute>
            } />

            <Route path="/generate" element={
              <ProtectedRoute user={user} requiredRole="ROLE_ADMIN">
                <GenerateTimetablePage user={user} />
              </ProtectedRoute>
            } />

            <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
