import { Link } from 'react-router-dom'
import type { LessonListItem } from '../../db/lessonsRepo'

export function LessonCard({
  lesson,
  preview = false,
}: {
  lesson: LessonListItem
  preview?: boolean
}) {
  const query = preview ? '?preview=1' : ''

  return (
    <article className="card border-0 shadow-sm mb-3">
      <div className="card-body p-4">
        <div className="d-flex flex-wrap align-items-start justify-content-between gap-2">
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <h2 className="h5 mb-0">{lesson.title}</h2>
              <span className="badge text-bg-light border">Level {lesson.level}</span>
              {lesson.inProduction ? null : (
                <span className="badge text-bg-warning">Draft</span>
              )}
            </div>
            {lesson.description ? (
              <p className="text-secondary mb-1">{lesson.description}</p>
            ) : null}
            <div className="small text-secondary">
              {lesson.questionCount}{' '}
              {lesson.questionCount === 1 ? 'sentence' : 'sentences'}
              {lesson.lastPlayedAt ? ' · played before' : ''}
            </div>
          </div>
          <div className="text-md-end">
            {lesson.completedAt ? (
              <div className="small text-success fw-semibold">
                <i className="bi bi-check-circle-fill me-1" aria-hidden="true" />
                Best score {lesson.bestScore}%
              </div>
            ) : (
              <div className="small text-secondary">Not completed yet</div>
            )}
          </div>
        </div>

        <div className="d-flex flex-wrap gap-2 mt-3">
          <Link
            to={`/lessons/${lesson.id}${query}`}
            className="btn btn-kuku"
            aria-disabled={lesson.questionCount === 0}
            onClick={(event) => {
              if (lesson.questionCount === 0) event.preventDefault()
            }}
          >
            {lesson.completedAt ? 'Practice again' : 'Start lesson'}
          </Link>
          {lesson.tutorial ? (
            <span className="btn btn-outline-secondary disabled" aria-disabled="true">
              <i className="bi bi-book me-1" aria-hidden="true" />
              Tutorial inside lesson
            </span>
          ) : null}
        </div>
      </div>
    </article>
  )
}
