import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function ProjectsOverview() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await api.get('/hq/projects');
        if (!cancelled) setProjects(res.data || []);
      } catch (e) {
        if (!cancelled) setError('Failed to load projects');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <p>Loading projects...</p>;
  if (error) return <p>{error}</p>;

  if (!projects.length) return <p>No projects found.</p>;

  return (
    <div>
      <h2>Projects</h2>
      <table border="1" cellPadding="6" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Status</th>
            <th>Manager</th>
            <th>Deadline</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((p) => (
            <tr key={p._id}>
              <td>{p.title}</td>
              <td><span className={`badge ${p.status === 'Completed' ? 'success' : p.status === 'Delayed' ? 'danger' : 'warn'}`}>{p.status}</span></td>
              <td>{p.managerId?.name || '—'}</td>
              <td>{p.deadline ? new Date(p.deadline).toLocaleDateString() : '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


