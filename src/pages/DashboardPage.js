import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCurrentUser, getUserCases, signOut } from '../lib/supabase';

function DashboardPage() {
  const [user, setUser] = useState(null);
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        navigate('/login');
        return;
      }
      setUser(currentUser);
      const { data } = await getUserCases(currentUser.id);
      setCases(data || []);
      setLoading(false);
    };
    loadData();
  }, [navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (loading) return <div className="dashboard-loading">Loading...</div>;

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>My Cases</h1>
        <div className="user-info">
          <span>{user?.email}</span>
          <button onClick={handleSignOut} className="btn-secondary">Sign Out</button>
        </div>
      </header>
      <div className="cases-grid">
        {cases.length === 0 ? (
          <div className="no-cases">
            <p>No cases yet. Start a new legal task!</p>
            <Link to="/" className="btn-primary">Browse Tasks</Link>
          </div>
        ) : (
          cases.map(c => (
            <div key={c.id} className="case-card">
              <h3>{c.task_type}</h3>
              <span className={`status ${c.status}`}>{c.status}</span>
              <p>Created: {new Date(c.created_at).toLocaleDateString()}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default DashboardPage;
