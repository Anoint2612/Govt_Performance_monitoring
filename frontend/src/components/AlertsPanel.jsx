import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function AlertsPanel() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await api.get('/hq/alerts');
        if (!cancelled) setAlerts(res.data || []);
      } catch (e) {
        if (!cancelled) setError('Failed to load alerts');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  if (loading) return <p>Loading alerts...</p>;
  if (error) return <p>{error}</p>;

  if (!alerts.length) return <p>No alerts.</p>;

  return (
    <div className="panel">
      <h3>Alerts</h3>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {alerts.map((al) => (
          <li key={al._id} style={{ padding: '10px 0', borderBottom: '1px solid #1f2937' }}>
            <span className={`badge ${al.type === 'Delay' ? 'danger' : al.type === 'TicketEscalation' ? 'warn' : 'success'}`} style={{ marginRight: 8 }}>{al.type}</span>
            {al.message}
            <span style={{ color: '#94a3b8', marginLeft: 8 }}>{new Date(al.createdAt).toLocaleString()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}


