import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

export function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="navbar navbar-expand-md bg-white border-bottom sticky-top">
      <div className="container app-container">
        <Link className="navbar-brand fw-bold" to="/" onClick={() => setOpen(false)}>
          kuku
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className={`collapse navbar-collapse${open ? ' show' : ''}`}>
          <ul className="navbar-nav ms-auto align-items-md-center gap-md-2">
            <li className="nav-item">
              <NavLink
                className="nav-link"
                to="/"
                end
                onClick={() => setOpen(false)}
              >
                Student
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className="nav-link"
                to="/admin"
                onClick={() => setOpen(false)}
              >
                Admin
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}
