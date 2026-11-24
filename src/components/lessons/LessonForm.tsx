import { useState, type FormEvent } from 'react'
import type { Lesson } from '../../db/db'
import type { LessonInput } from '../../db/lessonsRepo'
import { isValidationError } from '../../db/errors'
import { ErrorAlert, FieldError } from '../common/ErrorAlert'

export function LessonForm({
  initial,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  initial?: Lesson
  submitLabel: string
  onSubmit: (input: LessonInput) => Promise<void>
  onCancel: () => void
}) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [tutorial, setTutorial] = useState(initial?.tutorial ?? '')
  const [level, setLevel] = useState(initial?.level ?? 0)
  const [inProduction, setInProduction] = useState(initial?.inProduction === 1)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [error, setError] = useState<unknown>(null)
  const [busy, setBusy] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setBusy(true)
    setError(null)
    setFieldErrors({})

    try {
      await onSubmit({
        title,
        description,
        tutorial,
        level,
        inProduction: inProduction ? 1 : 0,
      })
    } catch (caught) {
      if (isValidationError(caught)) {
        setFieldErrors(caught.fieldErrors)
      } else {
        setError(caught)
      }
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="card border-0 shadow-sm">
      <div className="card-body p-4">
        <ErrorAlert error={error} />

        <div className="mb-3">
          <label htmlFor="lesson-title" className="form-label">
            Title
          </label>
          <input
            id="lesson-title"
            className={`form-control${fieldErrors.title ? ' is-invalid' : ''}`}
            value={title}
            maxLength={255}
            onChange={(event) => setTitle(event.target.value)}
            required
          />
          <FieldError errors={fieldErrors} field="title" />
        </div>

        <div className="mb-3">
          <label htmlFor="lesson-description" className="form-label">
            Short description
          </label>
          <textarea
            id="lesson-description"
            className={`form-control${fieldErrors.description ? ' is-invalid' : ''}`}
            rows={2}
            maxLength={300}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
          <FieldError errors={fieldErrors} field="description" />
        </div>

        <div className="mb-3">
          <label htmlFor="lesson-tutorial" className="form-label">
            Tutorial (Markdown)
          </label>
          <textarea
            id="lesson-tutorial"
            className={`form-control${fieldErrors.tutorial ? ' is-invalid' : ''}`}
            rows={8}
            maxLength={99999}
            value={tutorial}
            onChange={(event) => setTutorial(event.target.value)}
            placeholder={'# Grammar note\n\nWrite **Markdown** here…'}
          />
          <FieldError errors={fieldErrors} field="tutorial" />
          <div className="form-text">
            Shown in a modal when students start the lesson. Raw HTML is not rendered.
          </div>
        </div>

        <div className="row g-3 align-items-end mb-4">
          <div className="col-md-3">
            <label htmlFor="lesson-level" className="form-label">
              Level
            </label>
            <input
              id="lesson-level"
              type="number"
              min={0}
              className={`form-control${fieldErrors.level ? ' is-invalid' : ''}`}
              value={level}
              onChange={(event) => setLevel(Number(event.target.value))}
            />
            <FieldError errors={fieldErrors} field="level" />
          </div>
          <div className="col-md-9">
            <div className="form-check form-switch">
              <input
                id="lesson-published"
                type="checkbox"
                className="form-check-input"
                checked={inProduction}
                onChange={(event) => setInProduction(event.target.checked)}
              />
              <label className="form-check-label" htmlFor="lesson-published">
                Published — visible to students
              </label>
            </div>
          </div>
        </div>

        <div className="d-flex flex-wrap gap-2">
          <button type="submit" className="btn btn-kuku" disabled={busy}>
            {busy ? (
              <span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />
            ) : null}
            {submitLabel}
          </button>
          <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </form>
  )
}
