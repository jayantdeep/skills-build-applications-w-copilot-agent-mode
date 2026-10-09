import { Route, Routes } from 'react-router-dom'

function Dashboard() {
  return (
    <main className="container py-5">
      <header className="mb-5">
        <p className="text-uppercase fw-semibold text-success mb-2">OctoFit Tracker</p>
        <h1 className="display-5 fw-bold">Your movement, in focus.</h1>
      </header>
      <p className="lead text-body-secondary">Your training dashboard is ready.</p>
    </main>
  )
}

function NotFound() {
  return (
    <main className="container py-5">
      <h1 className="h2">Page not found</h1>
    </main>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
