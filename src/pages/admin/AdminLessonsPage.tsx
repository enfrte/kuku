import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ConfirmDialog } from '../../components/common/ConfirmDialog'
import { ErrorAlert } from '../../components/common/ErrorAlert'
import { EmptyState, Loading } from '../../components/common/Feedback'
import type { LessonListItem } from '../../db/lessonsRepo'
import { useCourse } from '../../hooks/useCourse'
import { useLessons } from '../../hooks/useLessons'
import { parseId } from '../params'

export function AdminLessonsPage() {
  const { courseId: courseIdParam } = useParams()
  const courseId = parseId(courseIdParam)
  const { course, isLoading: courseLoading, notFound } = useCourse(courseId)
  const { lessons, isLoading, deleteLesson, toggleLessonPublished } = useLessons(
    courseId,
    { includeUnpublished: true },
  )
  const [pendingDelete, setPendingDelete] = useState<LessonListItem | null>(null)
  const [busyId, setBusyId] = useState<number | null>(null)
  const [error, setError] = useState<unknown>(null)

  async function handleToggle(lesson: LessonListItem) {
    if (!lesson.id) return
    setBusyId(lesson.id)
    setError(null)
    try {
      await toggleLessonPublished(lesson.id)
    } catch (caught) {
      setError(caught)
    } finally {
      setBusyId(null)
    }
  }

  async function handleDelete() {
    if (!pendingDelete?.id) return
    setBusyId(pendingDelete.id)
    setError(null)
    try {
      await deleteLesson(pendingDelete.id)
      setPendingDelete(null)
    } catch (caught) {
      setError(caught)
    } finally {
      setBusyId(null)
    }
  }

  if (courseLoading) return <Loading label="Loading course…" />

  if (notFound || !course) {
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
            {course.title}
          </li>
        </ol>
      </nav>

      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
        <div>
          <h2 className="h4 mb-1">Lessons</h2>
          <p className="text-secondary mb-0">
            Course: {course.title}{' '}
            <Link to={`/courses/${course.id}?preview=1`} className="ms-1">
              preview as student
            </Link>
          </p>
        </div>
        <div className="d-flex gap-2">
          <Link to={`/admin/courses/${course.id}/edit`} className="btn btn-outline-dark">
            Edit course
          </Link>
          <Link
            to={`/admin/courses/${course.id}/lessons/new`}
            className="btn btn-kuku"
          >
            New lesson
          </Link>
        </div>
      </div>

      <ErrorAlert error={error} />

      {isLoading ? <Loading label="Loading lessons…" /> : null}

      {!isLoading && lessons && lessons.length === 0 ? (
        <EmptyState title="No lessons yet">
          <p>Add the first lesson to start building this course.</p>
          <Link
            to={`/admin/courses/${course.id}/lessons/new`}
            className="btn btn-kuku"
          >
            Create lesson
          </Link>
        </EmptyState>
      ) : null}

      {lessons && lessons.length > 0 ? (
        <div className="table-responsive bg-white rounded-4 shadow-sm">
          <table className="table align-middle mb-0">
            <thead>
              <tr>
                <th scope="col">Lesson</th>
                <th scope="col">Level</th>
                <th scope="col">Sentences</th>
                <th scope="col">Status</th>
                <th scope="col" className="text-end">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {lessons.map((lesson) => (
                <tr key={lesson.id}>
                  <td>
                    <div className="fw-semibold">{lesson.title}</div>
                    <div className="small text-secondary">
                      {lesson.description || 'No description'}
                    </div>
                  </td>
                  <td>{lesson.level}</td>
                  <td>{lesson.questionCount}</td>
                  <td>
                    <span
                      className={`badge ${
                        lesson.inProduction ? 'text-bg-success' : 'text-bg-secondary'
                      }`}
                    >
                      {lesson.inProduction ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="text-end">
                    <div className="d-flex flex-wrap gap-1 justify-content-end">
                      <Link
                        to={`/admin/lessons/${lesson.id}/questions`}
                        className="btn btn-sm btn-outline-dark"
                      >
                        Questions
                      </Link>
                      <Link
                        to={`/admin/lessons/${lesson.id}/edit`}
                        className="btn btn-sm btn-outline-dark"
                      >
                        Edit
                      </Link>
                      <Link
                        to={`/lessons/${lesson.id}?preview=1`}
                        className="btn btn-sm btn-outline-secondary"
                      >
                        Preview
                      </Link>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary"
                        disabled={busyId === lesson.id}
                        onClick={() => handleToggle(lesson)}
                      >
                        {lesson.inProduction ? 'Unpublish' : 'Publish'}
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        disabled={busyId === lesson.id}
                        onClick={() => setPendingDelete(lesson)}
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
      ) : null}

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete lesson?"
        body={`Delete “${pendingDelete?.title ?? ''}” and all of its questions and progress? This cannot be undone.`}
        busy={busyId !== null}
        onCancel={() => setPendingDelete(null)}
        onConfirm={handleDelete}
      />
    </div>
  )
}
