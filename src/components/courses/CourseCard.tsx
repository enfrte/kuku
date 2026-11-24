import { Link } from 'react-router-dom'
import { languageLabel } from '../../data/languages'
import type { CourseListItem } from '../../db/coursesRepo'
import { Flag } from '../common/Flag'

export function CourseCard({ course }: { course: CourseListItem }) {
  const percent =
    course.lessonCount > 0
      ? Math.round((course.completedLessonCount / course.lessonCount) * 100)
      : 0

  return (
    <Link
      to={`/courses/${course.id}`}
      className="text-decoration-none text-body"
      aria-label={`Open ${course.title}`}
    >
      <article className="card h-100 border-0 shadow-sm course-card">
        <div className="card-body d-flex flex-column align-items-center text-center p-4">
          <Flag code={course.language} size={78} />
          <h2 className="h5 mt-3 mb-1">{course.title}</h2>
          <p className="text-secondary small mb-3">
            {languageLabel(course.language)} · taught in{' '}
            {languageLabel(course.instructionLanguage)}
          </p>
          {course.description ? (
            <p className="text-secondary small mb-3">{course.description}</p>
          ) : null}
          <div className="mt-auto w-100">
            <div className="d-flex justify-content-between small text-secondary mb-1">
              <span>
                {course.lessonCount} {course.lessonCount === 1 ? 'lesson' : 'lessons'}
              </span>
              <span>
                {course.completedLessonCount}/{course.lessonCount} done
              </span>
            </div>
            <div className="progress" style={{ height: 8 }} role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
              <div className="progress-bar bg-kuku" style={{ width: `${percent}%` }} />
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}
