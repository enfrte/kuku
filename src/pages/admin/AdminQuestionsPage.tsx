import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ConfirmDialog } from '../../components/common/ConfirmDialog'
import { ErrorAlert } from '../../components/common/ErrorAlert'
import { EmptyState, Loading } from '../../components/common/Feedback'
import { BatchQuestionForm } from '../../components/questions/BatchQuestionForm'
import { QuestionForm } from '../../components/questions/QuestionForm'
import { QuestionList } from '../../components/questions/QuestionList'
import type { Question } from '../../db/db'
import { useCourse } from '../../hooks/useCourse'
import { useLesson } from '../../hooks/useLesson'
import { useQuestions } from '../../hooks/useQuestions'
import { parseId } from '../params'

export function AdminQuestionsPage() {
  const { lessonId: lessonIdParam } = useParams()
  const lessonId = parseId(lessonIdParam)

  const { lesson, isLoading: lessonLoading, notFound } = useLesson(lessonId)
  const { course, isLoading: courseLoading } = useCourse(lesson?.courseId)
  const {
    questions,
    isLoading,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    bulkCreateQuestions,
  } = useQuestions(lessonId)

  const [showCreate, setShowCreate] = useState(false)
  const [showBatch, setShowBatch] = useState(false)
  const [editing, setEditing] = useState<Question | null>(null)
  const [pendingDelete, setPendingDelete] = useState<Question | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<unknown>(null)

  async function handleDelete() {
    if (!pendingDelete?.id) return
    setBusy(true)
    setError(null)
    try {
      await deleteQuestion(pendingDelete.id)
      if (editing?.id === pendingDelete.id) setEditing(null)
      setPendingDelete(null)
    } catch (caught) {
      setError(caught)
    } finally {
      setBusy(false)
    }
  }

  if (lessonLoading || courseLoading) return <Loading label="Loading lesson…" />

  if (notFound || !lesson) {
    return (
      <EmptyState title="Lesson not found">
        <Link to="/admin">Back to admin</Link>
      </EmptyState>
    )
  }

  const backTo = course ? `/admin/courses/${course.id}/lessons` : '/admin'

  return (
    <div>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/admin">Admin</Link>
          </li>
          {course ? (
            <li className="breadcrumb-item">
              <Link to={backTo}>{course.title}</Link>
            </li>
          ) : null}
          <li className="breadcrumb-item active" aria-current="page">
            {lesson.title}
          </li>
        </ol>
      </nav>

      <div className="d-flex flex-wrap align-items-start justify-content-between gap-2 mb-3">
        <div>
          <h2 className="h4 mb-1">Questions</h2>
          <p className="text-secondary mb-0">
            Lesson: {lesson.title} · {questions?.length ?? 0} sentences
          </p>
        </div>
        <div className="d-flex flex-wrap gap-2">
          <Link to={backTo} className="btn btn-outline-dark">
            Back to lessons
          </Link>
          <button
            type="button"
            className="btn btn-outline-dark"
            onClick={() => {
              setShowBatch((value) => !value)
              setShowCreate(false)
            }}
          >
            Batch add
          </button>
          <button
            type="button"
            className="btn btn-kuku"
            onClick={() => {
              setShowCreate((value) => !value)
              setEditing(null)
              setShowBatch(false)
            }}
          >
            Add question
          </button>
        </div>
      </div>

      <ErrorAlert error={error} />

      {showCreate ? (
        <div className="mb-3">
          <QuestionForm
            submitLabel="Add question"
            onSubmit={async (input) => {
              await createQuestion(input)
              setShowCreate(false)
            }}
            onCancel={() => setShowCreate(false)}
          />
        </div>
      ) : null}

      {showBatch ? (
        <div className="mb-3">
          <BatchQuestionForm
            onSubmit={async (rows) => {
              const count = await bulkCreateQuestions(rows)
              return count
            }}
          />
        </div>
      ) : null}

      {editing ? (
        <div className="mb-3">
          <h3 className="h5">Edit question</h3>
          <QuestionForm
            key={editing.id}
            initial={editing}
            submitLabel="Save changes"
            onSubmit={async (input) => {
              if (!editing.id) return
              await updateQuestion(editing.id, input)
              setEditing(null)
            }}
            onCancel={() => setEditing(null)}
          />
        </div>
      ) : null}

      {isLoading ? <Loading label="Loading questions…" /> : null}

      {!isLoading && questions && questions.length === 0 ? (
        <EmptyState title="No questions yet">
          <p>
            Add sentences one at a time, or paste a batch of CSV lines. Each question
            becomes one word-tile exercise.
          </p>
        </EmptyState>
      ) : null}

      {questions && questions.length > 0 ? (
        <QuestionList
          questions={questions}
          editingId={editing?.id ?? null}
          onEdit={(question) => {
            setEditing(question)
            setShowCreate(false)
            setShowBatch(false)
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
          onDelete={setPendingDelete}
        />
      ) : null}

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete question?"
        body={`Delete “${pendingDelete?.nativePhrase ?? ''}” / “${pendingDelete?.foreignPhrase ?? ''}”? This cannot be undone.`}
        busy={busy}
        onCancel={() => setPendingDelete(null)}
        onConfirm={handleDelete}
      />
    </div>
  )
}
