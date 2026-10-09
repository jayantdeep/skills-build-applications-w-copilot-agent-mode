import { Link, NavLink, Route, Routes } from 'react-router-dom'
import logoUrl from '../../../docs/octofitapp-small.png'
import Activities from './components/Activities'
import Leaderboard from './components/Leaderboard'
import Teams from './components/Teams'
import Users from './components/Users'
import Workouts from './components/Workouts'
import './App.css'
import { fetchCollection } from './api'
import { useEffect, useState } from 'react'

const navItems = [
  { label: 'Dashboard', to: '/', exact: true },
  { label: 'Users', to: '/users' },
  { label: 'Teams', to: '/teams' },
  { label: 'Activities', to: '/activities' },
  { label: 'Leaderboard', to: '/leaderboard' },
  { label: 'Workouts', to: '/workouts' },
]

function Dashboard() {
  const [summary, setSummary] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true
    Promise.all([
      fetchCollection('/api/users/'),
      fetchCollection('/api/teams/'),
      fetchCollection('/api/activities/'),
      fetchCollection('/api/leaderboard/'),
      fetchCollection('/api/workouts/'),
    ]).then(([users, teams, activities, leaderboard, workouts]) => {
      if (!mounted) return
      const weekStart = new Date()
      weekStart.setDate(weekStart.getDate() - 7)
      const activeUserIds = new Set(
        activities
          .filter((activity) => new Date(activity.completedAt) >= weekStart)
          .map((activity) => activity.user?._id || activity.user?.id || activity.user),
      )
      const weeklyPoints = leaderboard
        .filter((entry) => entry.period === 'weekly')
        .reduce((total, entry) => total + (Number(entry.points) || 0), 0)

      setSummary({
        activeStudents: activeUserIds.size,
        studentCount: users.length,
        teamCount: teams.length,
        activityCount: activities.length,
        workoutCount: workouts.length,
        weeklyPoints,
      })
    }).catch((loadError) => {
      if (mounted) setError(loadError.message || 'Unable to load dashboard data.')
    })

    return () => {
      mounted = false
    }
  }, [])

  return (
    <main className="dashboard-page">
      <section className="hero-card mb-4">
        <div className="row align-items-center g-4">
          <div className="col-lg-7">
            <p className="eyebrow">School wellness at a glance</p>
            <h1 className="display-5 fw-bold mb-3">Your movement, in focus.</h1>
            <p className="lead text-body-secondary mb-4">
              Track workouts, celebrate progress, and keep every student moving with daily momentum.
            </p>
            <div className="d-flex flex-wrap gap-3">
              <NavLink className="btn btn-primary btn-lg" to="/users">View athletes</NavLink>
              <NavLink className="btn btn-outline-primary btn-lg" to="/leaderboard">See leaderboard</NavLink>
            </div>
          </div>
          <div className="col-lg-5">
            <div className="stats-panel">
              {error && <div className="error-state" role="alert">{error}</div>}
              <div className="stat-item">
                <span className="label">Active students</span>
                <strong>{summary ? `${summary.activeStudents} / ${summary.studentCount}` : 'Loading…'}</strong>
              </div>
              <div className="stat-item">
                <span className="label">Weekly points</span>
                <strong>{summary ? summary.weeklyPoints.toLocaleString() : 'Loading…'}</strong>
              </div>
              <div className="stat-item">
                <span className="label">Activities logged</span>
                <strong>{summary ? summary.activityCount : 'Loading…'}</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="row g-3">
        <div className="col-md-4">
          <div className="info-card success">
            <span className="badge">Teams</span>
            <h3>{summary ? summary.teamCount : '—'}</h3>
            <p>Teams taking part in friendly competition.</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="info-card warning">
            <span className="badge">Workouts</span>
            <h3>{summary ? summary.workoutCount : '—'}</h3>
            <p>Workout suggestions ready for students.</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="info-card info">
            <span className="badge">Students</span>
            <h3>{summary ? summary.studentCount : '—'}</h3>
            <p>Student profiles connected to the tracker.</p>
          </div>
        </div>
      </section>
    </main>
  )
}

function NotFound() {
  return (
    <main className="container py-5">
      <div className="empty-state">
        <h1 className="h2">Page not found</h1>
        <p className="text-body-secondary">The route you asked for is not available in Octofit Tracker.</p>
      </div>
    </main>
  )
}

function App() {
  return (
    <div className="app-shell">
      <nav className="navbar navbar-dark bg-primary shadow-sm">
        <div className="container">
          <Link className="navbar-brand d-flex align-items-center gap-3" to="/">
            <img src={logoUrl} alt="Octofit Tracker logo" className="app-logo" />
            <div>
              <div className="fw-bold">Octofit Tracker</div>
              <small className="text-white-50">Fitness challenge console</small>
            </div>
          </Link>
        </div>
      </nav>

      <div className="container py-4">
        <div className="nav-row row row-cols-2 row-cols-md-3 row-cols-lg-6 g-2 mb-4">
          {navItems.map(({ label, to, exact }) => (
            <div key={to} className="col">
              <NavLink
                to={to}
                end={exact}
                className={({ isActive }) => `nav-pill ${isActive ? 'active' : ''}`}
              >
                {label}
              </NavLink>
            </div>
          ))}
        </div>

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/workouts" element={<Workouts />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
