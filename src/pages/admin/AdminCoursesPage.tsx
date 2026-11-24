import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ConfirmDialog } from '../../components/common/ConfirmDialog'
import { ErrorAlert } from '../../components/common/ErrorAlert'
import { EmptyState, Loading } from '../../components/common/Feedback'
import { CourseTable } from '../../components/courses/CourseTable'
import type { CourseListItem } from '../../db/coursesRepo'
import { useCourses } from '../../hooks/useCourses'

export function AdminCoursesPage() {
  const [search, setSearch] = useState('')
  const { courses, isLoading, deleteCourse, toggleCoursePublished } = useCourses({
    includeUnpublished: true,
    search,
  })
  const [pendingDelete, setPendingDelete] = useState<CourseListItem | null>(null)
  const [busyId, setBusyId] = useState<number | null>(null)
  const [error, setError] = useState<unknown>(null)

  const publishedCount = courses?.filter((course) => course.inProduction).length ?? 0
  const lessonCount =
    courses?.reduce((total, course) => total + course.lessonCount, 0) ?? 0

  async function handleToggle(course: CourseListItem) {
    if (!course.id) return
    setBusyId(course.id)
    setError(null)
    try {
      await toggleCoursePublished(course.id)
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
      await deleteCourse(pendingDelete.id)
      setPendingDelete(null)
    } catch (caught) {
      setError(caught)
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div>
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="text-secondary small">Courses</div>
              <div className="h3 mb-0">{courses?.length ?? '—'}</div>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="text-secondary small">Published</div>
              <div className="h3 mb-0">{publishedCount}</div>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="text-secondary small">Lessons</div>
              <div className="h3 mb-0">{lessonCount}</div>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body d-flex flex-column justify-content-between">
              <div className="text-secondary small">Content</div>
              <Link to="/admin/courses/new" className="btn btn-kuku mt-2">
                New course
              </Link>
            </div>
          </div>
        </div>
      </div>

      <ErrorAlert error={error} />

      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
        <h2 className="h4 mb-0">All courses</h2>
        <div className="input-group" style={{ maxWidth: 340 }}>
          <span className="input-group-text bg-white">
            <i className="bi bi-search" aria-hidden="true" />
          </span>
          <input
            type="search"
            className="form-control"
            placeholder="Search courses…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search courses"
          />
        </div>
      </div>

      {isLoading ? <Loading label="Loading courses…" /> : null}

      {!isLoading && courses && courses.length === 0 ? (
        <EmptyState title={search ? 'No matching courses' : 'No courses yet'}>
          <p>
            {search
              ? 'Try a different search term.'
              : 'Create a course or load the demo course from the data page.'}
          </p>
          {!search ? (
            <Link to="/admin/courses/new" className="btn btn-kuku">
              Create your first course
            </Link>
          ) : null}
        </EmptyState>
      ) : null}

      {courses && courses.length > 0 ? (
        <CourseTable
          courses={courses}
          busyId={busyId}
          onTogglePublished={handleToggle}
          onDelete={setPendingDelete}
        />
      ) : null}

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete course?"
        body={`Delete “${pendingDelete?.title ?? ''}” and all of its lessons, questions, and progress? This cannot be undone unless you have a backup.`}
        busy={busyId !== null}
        onCancel={() => setPendingDelete(null)}
        onConfirm={handleDelete}
      />
    </div>
  )
}
