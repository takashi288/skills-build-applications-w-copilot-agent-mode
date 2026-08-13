import { useEffect, useState } from 'react';

const apiUrl = import.meta.env.VITE_CODESPACE_NAME
  ? `https://${import.meta.env.VITE_CODESPACE_NAME}-8000.app.github.dev/api/teams/`
  : 'http://localhost:8000/api/teams/';

const normalizeTeams = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.results)) return payload.results;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    fetch(apiUrl, { signal: controller.signal })
      .then((response) => response.json())
      .then((payload) => setTeams(normalizeTeams(payload)))
      .catch((fetchError) => {
        if (fetchError.name !== 'AbortError') {
          setError('Unable to load teams.');
        }
      });

    return () => controller.abort();
  }, []);

  return (
    <section className="card shadow-sm border-0 mt-4">
      <div className="card-body">
        <h2 className="h4 mb-3">Teams</h2>
        {error ? <p className="text-danger">{error}</p> : null}
        {!teams.length ? (
          <p className="text-muted mb-0">No teams available.</p>
        ) : (
          <div className="list-group list-group-flush">
            {teams.map((team) => (
              <div key={team.id ?? team._id} className="list-group-item px-0">
                <div className="d-flex justify-content-between align-items-center">
                  <strong>{team.name}</strong>
                  <span className="badge bg-info rounded-pill">{team.points ?? 0} pts</span>
                </div>
                <small className="text-muted">{team.members ?? 0} members</small>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
