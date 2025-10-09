import React, { useState } from 'react';
import api from '../services/api';

export default function ManagerManagement() {
  const [form, setForm] = useState({ name: '', email: '', password: '', dept: '' });
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  async function submit(e) {
    e.preventDefault();
    setStatus('');
    setError('');
    try {
      await api.post('/auth/register-manager', form);
      setStatus('Manager created');
      setForm({ name: '', email: '', password: '', dept: '' });
    } catch (e) {
      setError('Failed to create manager');
    }
  }

  return (
    <div className="panel">
      <h3>Add Manager</h3>
      <form onSubmit={submit} className="grid" style={{ maxWidth: 460 }}>
        <div className="field">
          <label>Name</label>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </div>
        <div className="field">
          <label>Email</label>
          <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        </div>
        <div className="field">
          <label>Password</label>
          <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        </div>
        <div className="field">
          <label>Department</label>
          <input value={form.dept} onChange={(e) => setForm({ ...form, dept: e.target.value })} />
        </div>
        <div className="row">
          <button className="btn" type="submit">Create</button>
          {status && <span className="badge success">{status}</span>}
          {error && <span className="badge danger">{error}</span>}
        </div>
      </form>
    </div>
  );
}



