import { Link } from 'react-router-dom'
import { languageLabel } from '../../data/languages'
import type { CourseListItem } from '../../db/coursesRepo'

export function CourseTable({
  courses,
  busyId,
  onTogglePublished,
  onDelete,
}: {
  courses: CourseListItem[]
  busyId?: number | null
  onTogglePublished: (course: CourseListItem) => void
  onDelete: (course: CourseListItem) => void
}) {
  return (
    <div className="table-responsive bg-white rounded-4 shadow-sm">
      <table className="table align-middle mb-0">
        <thead>
          <tr>
            <th scope="col">Course</th>
            <th scope="col">Languages</th>
            <th scope="col">Lessons</th>
            <th scope="col">Status</th>
            <th scope="col" className="text-end">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course.id}>
              <td>
                <div className="fw-semibold">{course.title}</div>
                <div className="small text-secondary">
                  {course.description || 'No description'}
                </div>
                <div className="small text-secondary font-monospace">{course.slug}</div>
              </td>
              <td className="small">
                <div>{languageLabel(course.language)}</div>
                <div className="text-secondary">
                  taught in {languageLabel(course.instructionLanguage)}
                </div>
              </td>
              <td>{course.lessonCount}</td>
              <td>
                <span
                  className={`badge ${
                    course.inProduction ? 'text-bg-success' : 'text-bg-secondary'
                  }`}
                >
                  {course.inProduction ? 'Published' : 'Draft'}
                </span>
              </td>
              <td className="text-end">
                <div className="d-flex flex-wrap gap-1 justify-content-end">
                  <Link
                    to={`/admin/courses/${course.id}/edit`}
                    className="btn btn-sm btn-outline-dark"
                  >
                    Edit
                  </Link>
                  <Link
                    to={`/admin/courses/${course.id}/lessons`}
                    className="btn btn-sm btn-outline-dark"
                  >
                    Lessons
                  </Link>
                  <Link
                    to={`/courses/${course.id}?preview=1`}
                    className="btn btn-sm btn-outline-secondary"
                  >
                    Preview
                  </Link>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    disabled={busyId === course.id}
                    onClick={() => onTogglePublished(course)}
                  >
                    {course.inProduction ? 'Unpublish' : 'Publish'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger"
                    disabled={busyId === course.id}
                    onClick={() => onDelete(course)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
