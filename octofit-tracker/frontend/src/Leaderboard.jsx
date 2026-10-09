import { useEffect, useState } from 'react';
import { apiBase, fetch } from './api';

export default function Leaderboard() {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        const data = await fetch('/api/leaderboard/');
        setRows(data);
      } catch (err) {
        setError(err.message || 'Unable to load leaderboard.');
      } finally {
        setLoading(false);
      }
    };

    loadLeaderboard();
  }, []);

  return (
    <main className="page-card">
      <div className="page-title d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2>Leaderboard</h2>
          <p>Friendly competition keeps the energy high.</p>
        </div>
        <span className="status-pill">{rows.length} ranked entries</span>
      </div>

      {loading ? (
        <div className="loading-state">Loading leaderboard…</div>
      ) : error ? (
        <div className="error-state">{error}</div>
      ) : (
        <div className="table-wrap">
          <table className="table resource-table align-middle">
            <thead>
              <tr>
                <th>Rank</th>
                <th>User</th>
                <th>Period</th>
                <th>Points</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row._id || row.id}>
                  <td>#{row.rank || '—'}</td>
                  <td>{row.user?.displayName || row.user?.username || 'Unknown athlete'}</td>
                  <td>{row.period || 'weekly'}</td>
                  <td>{row.points || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-3 small text-body-secondary">API endpoint: {apiBase}/api/leaderboard/</div>
    </main>
  );
}
