import { useEffect, useState } from 'react';

const codespaceName = import.meta.env.VITE_CODESPACE_NAME;
const apiBaseUrl = codespaceName ? `https://${codespaceName}-8000.app.github.dev` : 'http://localhost:8000';
const apiUrl = `${apiBaseUrl}/api/activities/`;

const normalizeActivities = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.results)) return payload.results;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

export default function Activities() {
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    fetch(apiUrl, { signal: controller.signal })
      .then((response) => response.json())
      .then((payload) => setActivities(normalizeActivities(payload)))
      .catch((fetchError) => {
        if (fetchError.name !== 'AbortError') {
          setError('Unable to load activities.');
        }
      });

    return () => controller.abort();
  }, []);

  return (
    <section className="card shadow-sm border-0 mt-4">
      <div className="card-body">
        <h2 className="h4 mb-3">Activities</h2>
        {error ? <p className="text-danger">{error}</p> : null}
        {!activities.length ? (
          <p className="text-muted mb-0">No activities available.</p>
        ) : (
          <div className="list-group list-group-flush">
            {activities.map((activity) => (
              <div key={activity.id ?? activity._id} className="list-group-item px-0">
                <div className="d-flex justify-content-between align-items-center">
                  <strong>{activity.type}</strong>
                  <span className="badge bg-success rounded-pill">{activity.calories ?? 0} cal</span>
                </div>
                <small className="text-muted">
                  {activity.duration ?? 0} min • user {activity.userId ?? 'n/a'}
                </small>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
