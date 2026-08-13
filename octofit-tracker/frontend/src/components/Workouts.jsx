import { useEffect, useState } from 'react';

const codespaceName = import.meta.env.VITE_CODESPACE_NAME;
const apiBaseUrl = codespaceName ? `https://${codespaceName}-8000.app.github.dev` : 'http://localhost:8000';
const apiUrl = `${apiBaseUrl}/api/workouts/`;

const normalizeWorkouts = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.results)) return payload.results;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

export default function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    fetch(apiUrl, { signal: controller.signal })
      .then((response) => response.json())
      .then((payload) => setWorkouts(normalizeWorkouts(payload)))
      .catch((fetchError) => {
        if (fetchError.name !== 'AbortError') {
          setError('Unable to load workouts.');
        }
      });

    return () => controller.abort();
  }, []);

  return (
    <section className="card shadow-sm border-0 mt-4">
      <div className="card-body">
        <h2 className="h4 mb-3">Workouts</h2>
        {error ? <p className="text-danger">{error}</p> : null}
        {!workouts.length ? (
          <p className="text-muted mb-0">No workouts available.</p>
        ) : (
          <div className="list-group list-group-flush">
            {workouts.map((workout) => (
              <div key={workout.id ?? workout._id} className="list-group-item px-0">
                <div className="d-flex justify-content-between align-items-center">
                  <strong>{workout.name}</strong>
                  <span className="badge bg-secondary rounded-pill">{workout.difficulty}</span>
                </div>
                <small className="text-muted">{workout.minutes ?? 0} minutes</small>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
