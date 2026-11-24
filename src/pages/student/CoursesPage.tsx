import { Link } from 'react-router-dom'
import { useCourses } from '../../hooks/useCourses'
import { CourseCard } from '../../components/courses/CourseCard'
import { EmptyState, Loading } from '../../components/common/Feedback'

export function CoursesPage() {
  const { courses, isLoading } = useCourses()

  return (
    <div>
      <div className="text-center py-4 py-md-5">
        <h1 className="display-6 fw-bold">Learn a language with kuku</h1>
        <p className="lead text-secondary mx-auto" style={{ maxWidth: 620 }}>
          Pick a course, build sentences from word tiles, and practice a little every
          day. Your progress is stored locally in your browser.
        </p>
      </div>

      {isLoading ? <Loading label="Loading courses…" /> : null}

      {!isLoading && courses && courses.length === 0 ? (
        <EmptyState title="No published courses yet">
          <p>
            Open the <Link to="/admin">admin area</Link> to create a course, or load
            the demo from the admin data page.
          </p>
        </EmptyState>
      ) : null}

      {courses && courses.length > 0 ? (
        <div className="row g-4">
          {courses.map((course) => (
            <div className="col-md-6" key={course.id}>
              <CourseCard course={course} />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}
