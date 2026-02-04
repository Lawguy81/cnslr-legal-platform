import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signUp, signInWithGoogle } from '../lib/supabase';

function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await signUp(email, password, fullName);
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
    }
  };

  const handleGoogleSignUp = async () => {
    const { error } = await signInWithGoogle();
    if (error) setError(error.message);
  };

  if (success) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h2>Check Your Email</h2>
          <p>We sent a confirmation link to {email}</p>
          <Link to="/login" className="btn-primary">Go to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Account</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Creating...' : 'Sign Up'}</button>
        </form>
        <div className="auth-divider"><span>or</span></div>
        <button onClick={handleGoogleSignUp} className="btn-google">Continue with Google</button>
        <p className="auth-link">Already have an account? <Link to="/login">Log in</Link></p>
      </div>
    </div>
  );
}

export default SignUpPage;
}

export default SignUpPage;
