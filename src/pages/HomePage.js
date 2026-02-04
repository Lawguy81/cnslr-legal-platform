import React from 'react';
import { Link } from 'react-router-dom';
import { legalTasks } from '../data/legalTasks';

function HomePage() {
  return (
    <div className="home-page">
      <header className="hero">
        <div className="hero-badge">✨ TurboTax for Legal</div>
        <h1>Handle Legal Matters<br />Without the Legal Fees</h1>
        <p>Step-by-step guidance for everyday legal tasks. Answer simple questions, get court-ready documents.</p>
        <div className="hero-buttons">
          <Link to="/signup" className="btn btn-primary btn-large">Get Started Free</Link>
          <Link to="/login" className="btn btn-secondary btn-large">Sign In</Link>
        </div>
      </header>

      <section className="tasks-section">
        <h2>What do you need help with?</h2>
        <div className="task-grid">
          {legalTasks.map(task => (
            <Link to={`/task/${task.id}`} key={task.id} className="task-card">
              <span className="task-icon">{task.icon}</span>
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <span className="task-time">{task.estimatedTime}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Answer Questions</h3>
            <p>Simple questions about your situation</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Review Documents</h3>
            <p>We generate the right legal forms</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>File or Submit</h3>
            <p>E-file or print and mail</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
