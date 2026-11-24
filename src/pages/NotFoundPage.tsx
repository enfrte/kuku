import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="text-center py-5">
      <h1 className="display-6">Page not found</h1>
      <p className="text-secondary">There is nothing at this address.</p>
      <Link to="/" className="btn btn-kuku">
        Back to courses
      </Link>
    </div>
  )
}
