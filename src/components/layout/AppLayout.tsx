import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'

export function AppLayout() {
  return (
    <div className="min-vh-100 d-flex flex-column">
      <Navbar />
      <main className="container app-container py-4 flex-grow-1">
        <Outlet />
      </main>
      <footer className="border-top bg-white py-3">
        <div className="container app-container small text-secondary d-flex flex-wrap gap-2 justify-content-between">
          <span>kuku — local-first language practice</span>
          <span>Your data stays in this browser.</span>
        </div>
      </footer>
    </div>
  )
}
