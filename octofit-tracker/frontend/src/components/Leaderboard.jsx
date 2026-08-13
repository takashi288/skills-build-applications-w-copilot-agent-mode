import { useEffect, useState } from 'react';
import { buildApiUrl } from '../config/api.js';

const normalizeLeaderboard = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.results)) return payload.results;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

export default function Leaderboard() {
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    fetch(buildApiUrl('leaderboard'), { signal: controller.signal })
      .then((response) => response.json())
      .then((payload) => setEntries(normalizeLeaderboard(payload)))
      .catch((fetchError) => {
        if (fetchError.name !== 'AbortError') {
          setError('Unable to load leaderboard.');
        }
      });

    return () => controller.abort();
  }, []);

  return (
    <section className="card shadow-sm border-0 mt-4">
      <div className="card-body">
        <h2 className="h4 mb-3">Leaderboard</h2>
        {error ? <p className="text-danger">{error}</p> : null}
        {!entries.length ? (
          <p className="text-muted mb-0">No leaderboard entries available.</p>
        ) : (
          <div className="list-group list-group-flush">
            {entries.map((entry) => (
              <div key={entry.rank ?? entry.name ?? entry._id} className="list-group-item px-0">
                <div className="d-flex justify-content-between align-items-center">
                  <strong>#{entry.rank ?? 0} {entry.name}</strong>
                  <span className="badge bg-warning text-dark rounded-pill">{entry.points ?? 0} pts</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
