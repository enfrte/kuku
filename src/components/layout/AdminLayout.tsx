import { NavLink, Outlet } from 'react-router-dom'

export function AdminLayout() {
  return (
    <div>
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
        <div>
          <h1 className="h3 mb-1">Admin</h1>
          <p className="text-secondary mb-0">
            Create and edit the content stored in this browser.
          </p>
        </div>
        <div className="btn-group" role="group" aria-label="Admin sections">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `btn ${isActive ? 'btn-dark' : 'btn-outline-dark'}`
            }
          >
            Courses
          </NavLink>
          <NavLink
            to="/admin/data"
            className={({ isActive }) =>
              `btn ${isActive ? 'btn-dark' : 'btn-outline-dark'}`
            }
          >
            Data &amp; backup
          </NavLink>
        </div>
      </div>
      <Outlet />
    </div>
  )
}
