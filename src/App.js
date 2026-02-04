import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import TaskWizard from './pages/TaskWizard';
import SuccessPage from './pages/SuccessPage';

function App() {
  return (
    <div className="app-container">
      <header className="header">
        <div className="header-content">
          <Link to="/" className="logo">
            <div className="logo-icon">C</div>
            CNSLR
          </Link>
          <nav className="nav-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/" className="nav-link">My Cases</Link>
            <Link to="/" className="nav-link">Help</Link>
          </nav>
        </div>
      </header>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/task/:taskId" element={<TaskWizard />} />
          <Route path="/success/:taskId" element={<SuccessPage />} />
        </Routes>
      </main>

      <footer className="footer">
        <p>&copy; 2026 CNSLR. Empowering everyday legal tasks. Not a law firm.</p>
      </footer>
    </div>
  );
}

export default App;
