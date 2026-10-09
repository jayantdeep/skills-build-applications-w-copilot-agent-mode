import { useEffect, useState } from 'react';
import { apiBase, fetch } from './api';

export default function Activities() {
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadActivities = async () => {
      try {
        const data = await fetch('/api/activities/');
        setActivities(data);
      } catch (err) {
        setError(err.message || 'Unable to load activities.');
      } finally {
        setLoading(false);
      }
    };

    loadActivities();
  }, []);

  return (
    <main className="page-card">
      <div className="page-title d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2>Activities</h2>
          <p>Recent fitness sessions and progress milestones.</p>
        </div>
        <span className="status-pill">{activities.length} entries</span>
      </div>

      {loading ? (
        <div className="loading-state">Loading activities…</div>
      ) : error ? (
        <div className="error-state">{error}</div>
      ) : (
        <div className="table-wrap">
          <table className="table resource-table align-middle">
            <thead>
              <tr>
                <th>Athlete</th>
                <th>Type</th>
                <th>Duration</th>
                <th>Distance</th>
                <th>Points</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((activity) => (
                <tr key={activity._id || activity.id}>
                  <td>{activity.user?.displayName || activity.user?.username || 'Unknown athlete'}</td>
                  <td>{activity.type || 'Workout'}</td>
                  <td>{activity.durationMinutes || 0} min</td>
                  <td>{activity.distanceKm ? `${activity.distanceKm} km` : '—'}</td>
                  <td>{activity.points || 0}</td>
                  <td>{activity.notes || 'No notes recorded'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-3 small text-body-secondary">API endpoint: {apiBase}/api/activities/</div>
    </main>
  );
}
