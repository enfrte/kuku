import { Link, useParams, useSearchParams } from 'react-router-dom'
import { languageLabel } from '../../data/languages'
import { Flag } from '../../components/common/Flag'
import { EmptyState, Loading } from '../../components/common/Feedback'
import { ProgressBar } from '../../components/quiz/ProgressBar'
import { LessonCard } from '../../components/lessons/LessonCard'
import { useCourse } from '../../hooks/useCourse'
import { useLessons } from '../../hooks/useLessons'
import { parseId } from '../params'

export function LessonsPage() {
  const { courseId: courseIdParam } = useParams()
  const [searchParams] = useSearchParams()
  const preview = searchParams.get('preview') === '1'
  const courseId = parseId(courseIdParam)

  const { course, isLoading: courseLoading, notFound } = useCourse(courseId)
  const { lessons, isLoading: lessonsLoading } = useLessons(courseId, {
    includeUnpublished: preview,
  })

  if (courseLoading) return <Loading label="Loading course…" />

  if (notFound || !course) {
    return (
      <EmptyState title="Course not found">
        <Link to="/">Back to courses</Link>
      </EmptyState>
    )
  }

  if (!preview && course.inProduction === 0) {
    return (
      <EmptyState title="Course unavailable">
        <p>This course is not published yet.</p>
        <Link to="/">Back to courses</Link>
      </EmptyState>
    )
  }

  const completed = lessons?.filter((lesson) => lesson.completedAt).length ?? 0
  const percent =
    lessons && lessons.length > 0 ? Math.round((completed / lessons.length) * 100) : 0

  return (
    <div>
      <Link to="/" className="btn btn-link px-0">
        <i className="bi bi-arrow-left me-1" aria-hidden="true" />
        All courses
      </Link>

      {preview && course.inProduction === 0 ? (
        <div className="alert alert-warning">
          Preview mode — this course is still a draft.
        </div>
      ) : null}

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-4 d-flex flex-column flex-md-row align-items-md-center gap-3">
          <Flag code={course.language} size={72} />
          <div className="flex-grow-1">
            <h1 className="h3 mb-1">{course.title}</h1>
            <p className="text-secondary mb-2">
              {languageLabel(course.language)} · taught in{' '}
              {languageLabel(course.instructionLanguage)}
            </p>
            {course.description ? (
              <p className="mb-0">{course.description}</p>
            ) : null}
          </div>
          <div style={{ minWidth: 180 }}>
            <div className="small text-secondary mb-1">
              {completed} of {lessons?.length ?? 0} lessons complete
            </div>
            <ProgressBar percent={percent} label="Course progress" />
          </div>
        </div>
      </div>

      <h2 className="h4 mb-3">Lessons</h2>

      {lessonsLoading ? <Loading label="Loading lessons…" /> : null}

      {lessons && lessons.length === 0 ? (
        <EmptyState title="No lessons yet">
          <p>This course does not have any published lessons.</p>
        </EmptyState>
      ) : null}

      {lessons?.map((lesson) => (
        <LessonCard key={lesson.id} lesson={lesson} preview={preview} />
      ))}
    </div>
  )
}
