import { Link, useNavigate, useParams } from 'react-router-dom'
import { EmptyState, Loading } from '../../components/common/Feedback'
import { CourseForm } from '../../components/courses/CourseForm'
import { useCourse } from '../../hooks/useCourse'
import { useCourses } from '../../hooks/useCourses'
import { parseId } from '../params'

export function CourseFormPage() {
  const { courseId: courseIdParam } = useParams()
  const navigate = useNavigate()
  const courseId = parseId(courseIdParam)
  const isEdit = courseIdParam !== undefined

  const { course, isLoading, notFound, updateCourse } = useCourse(courseId)
  const { createCourse } = useCourses({ includeUnpublished: true })

  if (isEdit && isLoading) return <Loading label="Loading course…" />

  if (isEdit && (notFound || !course)) {
    return (
      <EmptyState title="Course not found">
        <Link to="/admin">Back to admin</Link>
      </EmptyState>
    )
  }

  return (
    <div>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/admin">Admin</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {isEdit ? 'Edit course' : 'New course'}
          </li>
        </ol>
      </nav>

      <h2 className="h4 mb-3">
        {isEdit ? `Edit “${course?.title}”` : 'Create a course'}
      </h2>

      <CourseForm
        initial={course}
        submitLabel={isEdit ? 'Save changes' : 'Create course'}
        onCancel={() => navigate(isEdit && course ? '/admin' : '/admin')}
        onSubmit={async (input) => {
          if (isEdit && course?.id) {
            await updateCourse(input)
            navigate('/admin')
          } else {
            const newId = await createCourse(input)
            navigate(`/admin/courses/${newId}/lessons`)
          }
        }}
      />
    </div>
  )
}
