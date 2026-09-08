import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, User, AlertCircle, ArrowRight } from 'lucide-react';

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Invalid username or password');
      }

      const data = await res.json();
      onLogin(data);
      if (data.role === 'ROLE_ADMIN') {
        navigate('/dashboard');
      } else {
        navigate('/my-lesson-plans');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '1.5rem' }}>
      <div className="fade-in-up" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div className="brand-wordmark" style={{ fontSize: '2.5rem', lineHeight: 1 }}>
          Odysseus
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.85rem', maxWidth: '360px', marginLeft: 'auto', marginRight: 'auto' }}>
          Smart classroom scheduling and lesson planning for credit-based curricula.
        </p>
      </div>

      <div className="glass-panel fade-in-up" style={{ width: '100%', maxWidth: '420px', padding: '32px 28px', boxShadow: '0 12px 40px rgba(0,0,0,0.8)', animationDelay: '0.08s' }}>
        <div style={{ marginBottom: '1.75rem' }}>
          <h2 style={{ fontSize: '1.75rem' }}>Sign In</h2>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', marginTop: '0.3rem' }}>
            Enter your institutional credentials to continue.
          </p>
        </div>

        {error && (
          <div className="alert alert-danger">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username:</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: '2.75rem' }}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label className="form-label">Password:</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
              <input
                type="password"
                className="form-input"
                style={{ paddingLeft: '2.75rem' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.9rem' }} disabled={loading}>
            {loading ? 'Authenticating…' : <>Sign In to Odysseus <ArrowRight size={16} /></>}
          </button>
        </form>

        <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)', textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-dim)' }}>
          <p style={{ marginBottom: '0.35rem', fontWeight: 600, color: 'var(--text-muted)' }}>Demo credentials</p>
          <p>Admin <code>admin</code> / <code>admin123</code></p>
          <p>Faculty <code>faculty</code> / <code>faculty123</code></p>
        </div>

        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <Link to="/" style={{ color: 'var(--text-dim)', fontSize: '0.82rem', textDecoration: 'none' }}>
            ← Back to Landing Page
          </Link>
        </div>
      </div>
    </div>
  );
}
