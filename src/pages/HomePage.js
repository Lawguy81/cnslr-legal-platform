import React from 'react';
import { Link } from 'react-router-dom';
import { legalTasks } from '../data/legalTasks';

function HomePage() {
  return (
    <>
      <section className="hero">
        <h1>Legal Tasks Made Simple</h1>
        <p>
          Handle everyday legal matters with confidence. Our step-by-step guides
          walk you through each process — just like filing your taxes.
        </p>
        <Link to="/task/parking-ticket" className="btn btn-primary btn-lg">
          Get Started Free
        </Link>
      </section>

      <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Choose Your Legal Task</h2>

      <div className="tasks-grid">
        {legalTasks.map((task) => (
          <Link to={`/task/${task.id}`} key={task.id} className="task-card">
            <div className="task-icon" style={{ background: task.color }}>
              {task.icon}
            </div>
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <div className="task-time">
              <span>⏱️</span>
              <span>{task.estimatedTime}</span>
            </div>
          </Link>
        ))}
      </div>

      <section style={{
        background: 'white',
        borderRadius: '12px',
        padding: '2rem',
        boxShadow: 'var(--shadow)',
        marginTop: '2rem'
      }}>
        <h2 style={{ marginBottom: '1.5rem' }}>How It Works</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: '#eff6ff',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              fontSize: '1.5rem'
            }}>1</div>
            <h4 style={{ marginBottom: '0.5rem' }}>Answer Questions</h4>
            <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>
              Simple questions guide you through your specific situation
            </p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: '#eff6ff',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              fontSize: '1.5rem'
            }}>2</div>
            <h4 style={{ marginBottom: '0.5rem' }}>Review & Edit</h4>
            <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>
              See your completed documents and make any needed changes
            </p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: '#eff6ff',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              fontSize: '1.5rem'
            }}>3</div>
            <h4 style={{ marginBottom: '0.5rem' }}>Submit</h4>
            <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>
              Download for manual submission or e-file where available
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

export default HomePage;
