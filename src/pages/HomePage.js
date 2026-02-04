import React from 'react';
import { Link } from 'react-router-dom';
import { legalTasks } from '../data/legalTasks';

const styles = {
  page: { minHeight: '100vh', backgroundColor: '#0d1117', color: '#e6edf3' },
  hero: { textAlign: 'center', padding: '4rem 2rem', background: 'linear-gradient(180deg, #161b22 0%, #0d1117 100%)', borderBottom: '1px solid #30363d' },
  badge: { display: 'inline-block', background: 'rgba(88, 166, 255, 0.15)', color: '#58a6ff', padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.875rem', fontWeight: 500, marginBottom: '1.5rem' },
  h1: { fontSize: '3rem', fontWeight: 700, color: '#e6edf3', marginBottom: '1rem', lineHeight: 1.2 },
  subtitle: { fontSize: '1.25rem', color: '#8b949e', maxWidth: '600px', margin: '0 auto 2rem' },
  buttons: { display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' },
  btnPrimary: { padding: '1rem 2rem', borderRadius: '8px', fontWeight: 600, fontSize: '1.1rem', backgroundColor: '#58a6ff', color: 'white', textDecoration: 'none', border: 'none' },
  btnSecondary: { padding: '1rem 2rem', borderRadius: '8px', fontWeight: 600, fontSize: '1.1rem', backgroundColor: '#21262d', color: '#e6edf3', textDecoration: 'none', border: '1px solid #30363d' },
  section: { padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto' },
  sectionTitle: { fontSize: '2rem', textAlign: 'center', marginBottom: '2rem', color: '#e6edf3' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' },
  card: { backgroundColor: '#161b22', border: '1px solid #30363d', borderRadius: '12px', padding: '1.5rem', textDecoration: 'none', color: 'inherit', transition: 'all 0.2s' },
  cardIcon: { fontSize: '2rem', marginBottom: '1rem' },
  cardTitle: { fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem', color: '#e6edf3' },
  cardDesc: { color: '#8b949e', marginBottom: '1rem', fontSize: '0.9rem' },
  cardTime: { fontSize: '0.875rem', color: '#6e7681' }
};

function HomePage() {
  return (
    <div style={styles.page}>
      <header style={styles.hero}>
        <div style={styles.badge}>✨ TurboTax for Legal</div>
        <h1 style={styles.h1}>Handle Legal Matters<br />Without the Legal Fees</h1>
        <p style={styles.subtitle}>Step-by-step guidance for everyday legal tasks. Answer simple questions, get court-ready documents.</p>
        <div style={styles.buttons}>
          <Link to="/signup" style={styles.btnPrimary}>Get Started Free</Link>
          <Link to="/login" style={styles.btnSecondary}>Sign In</Link>
        </div>
      </header>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>What do you need help with?</h2>
        <div style={styles.grid}>
          {legalTasks.map(task => (
            <Link to={`/task/${task.id}`} key={task.id} style={styles.card}>
              <span style={styles.cardIcon}>{task.icon}</span>
              <h3 style={styles.cardTitle}>{task.title}</h3>
              <p style={styles.cardDesc}>{task.description}</p>
              <span style={styles.cardTime}>⏱ {task.estimatedTime}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

export default HomePage;
