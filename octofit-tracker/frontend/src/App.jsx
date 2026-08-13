import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import Activities from './components/Activities.jsx';
import Leaderboard from './components/Leaderboard.jsx';
import Teams from './components/Teams.jsx';
import Users from './components/Users.jsx';
import Workouts from './components/Workouts.jsx';

const navItems = [
  { path: '/', label: 'Overview' },
  { path: '/users', label: 'Users' },
  { path: '/teams', label: 'Teams' },
  { path: '/activities', label: 'Activities' },
  { path: '/leaderboard', label: 'Leaderboard' },
  { path: '/workouts', label: 'Workouts' },
];

function Overview() {
  return (
    <div className="row g-4">
      <div className="col-md-6">
        <Users />
      </div>
      <div className="col-md-6">
        <Teams />
      </div>
      <div className="col-md-6">
        <Activities />
      </div>
      <div className="col-md-6">
        <Workouts />
      </div>
      <div className="col-12">
        <Leaderboard />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="container py-4">
        <nav className="navbar navbar-expand-lg navbar-light bg-light rounded mb-4 px-3 shadow-sm">
          <div className="container-fluid">
            <span className="navbar-brand fw-bold">OctoFit Tracker</span>
            <div className="navbar-nav flex-row flex-wrap gap-3">
              {navItems.map((item) => (
                <Link key={item.path} className="nav-link" to={item.path}>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/users" element={<Users />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/workouts" element={<Workouts />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
