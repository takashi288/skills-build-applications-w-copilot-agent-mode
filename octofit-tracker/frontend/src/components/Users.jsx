import { useEffect, useState } from 'react';

const apiUrl = import.meta.env.VITE_CODESPACE_NAME
  ? `https://${import.meta.env.VITE_CODESPACE_NAME}-8000.app.github.dev/api/users/`
  : 'http://localhost:8000/api/users/';

const normalizeUsers = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.results)) return payload.results;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

export default function Users() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    fetch(apiUrl, { signal: controller.signal })
      .then((response) => response.json())
      .then((payload) => setUsers(normalizeUsers(payload)))
      .catch((fetchError) => {
        if (fetchError.name !== 'AbortError') {
          setError('Unable to load users.');
        }
      });

    return () => controller.abort();
  }, []);

  return (
    <section className="card shadow-sm border-0 mt-4">
      <div className="card-body">
        <h2 className="h4 mb-3">Users</h2>
        {error ? <p className="text-danger">{error}</p> : null}
        {!users.length ? (
          <p className="text-muted mb-0">No users available.</p>
        ) : (
          <div className="list-group list-group-flush">
            {users.map((user) => (
              <div key={user.id ?? user.email ?? user._id} className="list-group-item px-0">
                <div className="d-flex justify-content-between align-items-center">
                  <strong>{user.name}</strong>
                  <span className="badge bg-primary rounded-pill">{user.points ?? 0} pts</span>
                </div>
                <small className="text-muted">{user.email}</small>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
