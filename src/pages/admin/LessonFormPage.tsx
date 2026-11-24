import { Link, useNavigate, useParams } from 'react-router-dom'
import { EmptyState, Loading } from '../../components/common/Feedback'
import { LessonForm } from '../../components/lessons/LessonForm'
import { useCourse } from '../../hooks/useCourse'
import { useLesson } from '../../hooks/useLesson'
import { useLessons } from '../../hooks/useLessons'
import { parseId } from '../params'

export function LessonFormPage() {
  const { courseId: courseIdParam, lessonId: lessonIdParam } = useParams()
  const navigate = useNavigate()
  const isEdit = lessonIdParam !== undefined
  const lessonId = parseId(lessonIdParam)

  const {
    lesson,
    isLoading: lessonLoading,
    notFound: lessonNotFound,
    updateLesson,
  } = useLesson(lessonId)

  const courseId = isEdit ? lesson?.courseId : parseId(courseIdParam)
  const {
    course,
    isLoading: courseLoading,
    notFound: courseNotFound,
  } = useCourse(courseId)
  const { createLesson } = useLessons(courseId, { includeUnpublished: true })

  if (isEdit && lessonLoading) return <Loading label="Loading lesson…" />
  if (courseLoading) return <Loading label="Loading course…" />

  if (isEdit && (lessonNotFound || !lesson)) {
    return (
      <EmptyState title="Lesson not found">
        <Link to="/admin">Back to admin</Link>
      </EmptyState>
    )
  }

  if (courseNotFound || !course) {
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
          <li className="breadcrumb-item">
            <Link to={`/admin/courses/${course.id}/lessons`}>{course.title}</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {isEdit ? 'Edit lesson' : 'New lesson'}
          </li>
        </ol>
      </nav>

      <h2 className="h4 mb-3">
        {isEdit ? `Edit “${lesson?.title}”` : `New lesson in ${course.title}`}
      </h2>

      <LessonForm
        initial={lesson}
        submitLabel={isEdit ? 'Save changes' : 'Create lesson'}
        onCancel={() => navigate(`/admin/courses/${course.id}/lessons`)}
        onSubmit={async (input) => {
          if (isEdit && lesson?.id) {
            await updateLesson(input)
            navigate(`/admin/courses/${course.id}/lessons`)
          } else {
            const newId = await createLesson(input)
            navigate(`/admin/lessons/${newId}/questions`)
          }
        }}
      />
    </div>
  )
}
