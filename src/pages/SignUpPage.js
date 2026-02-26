import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

function SignUpPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const s = {
    page: { minHeight: '100vh', background: '#0d1117', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, sans-serif' },
    card: { background: '#161b22', borderRadius: 12, padding: 40, width: 400, border: '1px solid #30363d' },
    title: { color: '#e6edf3', fontSize: 24, marginBottom: 8, textAlign: 'center' },
    subtitle: { color: '#8b949e', fontSize: 14, textAlign: 'center', marginBottom: 24 },
    label: { color: '#e6edf3', fontSize: 14, display: 'block', marginBottom: 6 },
    input: { width: '100%', padding: '10px 12px', background: '#0d1117', border: '1px solid #30363d', borderRadius: 8, color: '#e6edf3', fontSize: 14, marginBottom: 16, boxSizing: 'border-box' },
    btn: { width: '100%', padding: 12, background: '#58a6ff', color: '#fff', border: 'none', borderRadius: 8, fontSize: 16, fontWeight: 600, cursor: 'pointer' },
    error: { background: '#f8514926', border: '1px solid #f85149', color: '#f85149', padding: 10, borderRadius: 8, fontSize: 13, marginBottom: 16 },
    link: { color: '#58a6ff', textDecoration: 'none' },
    footer: { color: '#8b949e', fontSize: 13, textAlign: 'center', marginTop: 16 },
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <h1 style={s.title}>Create Account</h1>
        <p style={s.subtitle}>Start fighting your parking ticket</p>
        {error && <div style={s.error}>{error}</div>}
        <form onSubmit={handleSignUp}>
          <label style={s.label}>Email</label>
          <input style={s.input} type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          <label style={s.label}>Password</label>
          <input style={s.input} type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          <button style={s.btn} type="submit" disabled={loading}>{loading ? 'Creating...' : 'Sign Up'}</button>
        </form>
        <p style={s.footer}>Already have an account? <Link to="/login" style={s.link}>Log in</Link></p>
      </div>
    </div>
  );
}

export default SignUpPage;

