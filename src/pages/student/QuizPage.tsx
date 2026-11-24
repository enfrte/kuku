import { useEffect, useRef, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { EmptyState, Loading } from '../../components/common/Feedback'
import { QuizBoard } from '../../components/quiz/QuizBoard'
import { TutorialModal } from '../../components/quiz/TutorialModal'
import { useCourse } from '../../hooks/useCourse'
import { useLesson } from '../../hooks/useLesson'
import { useLessonProgress } from '../../hooks/useProgress'
import { useQuestions } from '../../hooks/useQuestions'
import { parseId } from '../params'

export function QuizPage() {
  const { lessonId: lessonIdParam } = useParams()
  const [searchParams] = useSearchParams()
  const preview = searchParams.get('preview') === '1'
  const lessonId = parseId(lessonIdParam)

  const { lesson, isLoading: lessonLoading, notFound } = useLesson(lessonId)
  const { course, isLoading: courseLoading } = useCourse(lesson?.courseId)
  const { questions, isLoading: questionsLoading } = useQuestions(lessonId)
  const { progress, markLessonStarted, recordLessonResult } =
    useLessonProgress(lessonId)
  const [showTutorial, setShowTutorial] = useState(false)
  const startedRef = useRef(false)

  useEffect(() => {
    if (!lesson || startedRef.current) return
    startedRef.current = true
    void markLessonStarted(lesson.courseId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson])

  if (lessonLoading || courseLoading) return <Loading label="Loading lesson…" />

  if (notFound || !lesson) {
    return (
      <EmptyState title="Lesson not found">
        <Link to="/">Back to courses</Link>
      </EmptyState>
    )
  }

  if (
    !preview &&
    (lesson.inProduction === 0 || (course !== undefined && course.inProduction === 0))
  ) {
    return (
      <EmptyState title="Lesson unavailable">
        <p>This lesson is not published yet.</p>
        <Link to="/">Back to courses</Link>
      </EmptyState>
    )
  }

  const backTo = `/courses/${lesson.courseId}${preview ? '?preview=1' : ''}`

  return (
    <div>
      <div className="d-flex flex-wrap align-items-start justify-content-between gap-2 mb-3">
        <div>
          <Link to={backTo} className="btn btn-link px-0">
            <i className="bi bi-arrow-left me-1" aria-hidden="true" />
            Back to lessons
          </Link>
          <h1 className="h3 mb-1">{lesson.title}</h1>
          <div className="small text-secondary">
            Level {lesson.level}
            {progress?.completedAt
              ? ` · Best score ${progress.bestScore}%`
              : ' · Not completed yet'}
          </div>
        </div>
        {lesson.tutorial ? (
          <button
            type="button"
            className="btn btn-outline-dark"
            onClick={() => setShowTutorial(true)}
          >
            <i className="bi bi-book me-1" aria-hidden="true" />
            Tutorial
          </button>
        ) : null}
      </div>

      {questionsLoading ? <Loading label="Loading sentences…" /> : null}

      {questions && questions.length === 0 ? (
        <EmptyState title="No sentences yet">
          <p>Add questions in the admin area before practicing this lesson.</p>
        </EmptyState>
      ) : null}

      {questions && questions.length > 0 ? (
        <QuizBoard
          questions={questions}
          language={course?.language ?? 'swe'}
          backTo={backTo}
          onComplete={(correct, total) => {
            void recordLessonResult({
              courseId: lesson.courseId,
              lessonId: lesson.id!,
              correct,
              total,
            })
          }}
        />
      ) : null}

      <TutorialModal
        open={showTutorial}
        title={lesson.title}
        markdown={lesson.tutorial}
        onClose={() => setShowTutorial(false)}
      />
    </div>
  )
}
