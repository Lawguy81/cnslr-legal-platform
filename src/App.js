import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import TaskWizard from './pages/TaskWizard';
import SuccessPage from './pages/SuccessPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import DashboardPage from './pages/DashboardPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/task/:taskId" element={<TaskWizard />} />
          <Route path="/success/:taskId" element={<SuccessPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
