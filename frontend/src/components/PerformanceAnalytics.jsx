import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function PerformanceAnalytics() {
  const [criteria, setCriteria] = useState({ minScore: 0, maxScore: 100 });
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function load() {
    setLoading(true);
    setError('');
    try {
      const res = await api.get(`/hq/performance?minScore=${criteria.minScore}&maxScore=${criteria.maxScore}`);
      setData(res.data.employees || []);
    } catch (e) {
      setError('Failed to load performance');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); // initial
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="panel">
      <h3>Performance Analytics</h3>
      <div className="row" style={{ marginBottom: 12 }}>
        <div className="field" style={{ width: 120 }}>
          <label>Min score</label>
          <input type="number" value={criteria.minScore} onChange={(e) => setCriteria({ ...criteria, minScore: Number(e.target.value) })} />
        </div>
        <div className="field" style={{ width: 120 }}>
          <label>Max score</label>
          <input type="number" value={criteria.maxScore} onChange={(e) => setCriteria({ ...criteria, maxScore: Number(e.target.value) })} />
        </div>
        <button className="btn" onClick={load}>Filter</button>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p className="badge danger">{error}</p>}
      {!loading && !error && (
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Dept</th>
              <th>Level</th>
            </tr>
          </thead>
          <tbody>
            {data.map((u) => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.dept || '—'}</td>
                <td>{u.level || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}



