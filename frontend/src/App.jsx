import React, { useState } from 'react';
import ProjectsOverview from './components/ProjectsOverview';
import Dashboard from './components/Dashboard';
import AlertsPanel from './components/AlertsPanel';
import ManagerManagement from './components/ManagerManagement';
import PerformanceAnalytics from './components/PerformanceAnalytics';
import './styles.css';
import api, { setAuthToken } from './services/api';

export default function App() {
  const [token, setToken] = useState('');

  async function doLogin(e) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email');
    const password = formData.get('password');
    const res = await api.post('/auth/login', { email, password });
    setToken(res.data.token);
    setAuthToken(res.data.token);
  }

  if (!token) {
    return (
      <form onSubmit={doLogin}>
        <h3>HQ Admin Login</h3>
        <input name="email" placeholder="email" />
        <input name="password" type="password" placeholder="password" />
        <button>Login</button>
      </form>
    );
  }

  return (
    <div className="app-shell">
      <div className="topbar">
        <div className="brand">HQ Admin</div>
        <div className="token-actions">
          <button className="btn secondary" onClick={() => { setToken(''); setAuthToken(''); }}>Logout</button>
        </div>
      </div>
      <div className="content">
        <aside className="sidebar">
          <nav className="nav">
            <button className="active" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Dashboard</button>
            <button onClick={() => document.getElementById('projects').scrollIntoView({ behavior: 'smooth' })}>Projects</button>
            <button onClick={() => document.getElementById('alerts').scrollIntoView({ behavior: 'smooth' })}>Alerts</button>
            <button onClick={() => document.getElementById('managers').scrollIntoView({ behavior: 'smooth' })}>Managers</button>
            <button onClick={() => document.getElementById('performance').scrollIntoView({ behavior: 'smooth' })}>Performance</button>
          </nav>
        </aside>
        <main className="main">
          <div className="panel" style={{ marginBottom: 12 }}>
            <h2 style={{ marginTop: 0 }}>HQ Dashboard</h2>
          </div>
          <Dashboard />
          <div className="spacer" />
          <div id="projects" className="panel">
            <ProjectsOverview />
          </div>
          <div id="alerts" className="spacer" />
          <AlertsPanel />
          <div id="managers" className="spacer" />
          <ManagerManagement />
          <div id="performance" className="spacer" />
          <PerformanceAnalytics />
        </main>
      </div>
    </div>
  );
}
