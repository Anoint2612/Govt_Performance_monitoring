import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    (async () => {
      const [p, a] = await Promise.all([
        api.get('/hq/projects'),
        api.get('/hq/alerts')
      ]);
      setProjects(p.data);
      setAlerts(a.data);
    })();
  }, []);

  return (
    <div className="grid cols-2">
      <div className="panel">
        <h3>Recent Projects</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {projects.slice(0, 6).map((p) => (
              <tr key={p._id}>
                <td>{p.title}</td>
                <td>
                  <span className={`badge ${p.status === 'Completed' ? 'success' : p.status === 'Delayed' ? 'danger' : 'warn'}`}>
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="panel">
        <h3>Latest Alerts</h3>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {alerts.slice(0, 8).map((al) => (
            <li key={al._id} style={{ padding: '8px 0', borderBottom: '1px solid #1f2937' }}>
              <span className={`badge ${al.type === 'Delay' ? 'danger' : 'warn'}`} style={{ marginRight: 8 }}>{al.type}</span>
              {al.message}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
