import { useState, type FormEvent } from 'react'
import { languageLabel } from '../../data/languages'
import type { Course } from '../../db/db'
import type { CourseInput } from '../../db/coursesRepo'
import { isValidationError } from '../../db/errors'
import { slugify } from '../../db/slug'
import { ErrorAlert, FieldError } from '../common/ErrorAlert'
import { LanguageSelect } from '../common/LanguageSelect'

export function CourseForm({
  initial,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  initial?: Course
  submitLabel: string
  onSubmit: (input: CourseInput) => Promise<void>
  onCancel: () => void
}) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [language, setLanguage] = useState(initial?.language ?? 'swe')
  const [instructionLanguage, setInstructionLanguage] = useState(
    initial?.instructionLanguage ?? 'eng',
  )
  const [version, setVersion] = useState(initial?.version ?? 1)
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
        language,
        instructionLanguage,
        version,
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
          <label htmlFor="course-title" className="form-label">
            Title
          </label>
          <input
            id="course-title"
            className={`form-control${fieldErrors.title ? ' is-invalid' : ''}`}
            value={title}
            maxLength={255}
            onChange={(event) => setTitle(event.target.value)}
            required
          />
          <FieldError errors={fieldErrors} field="title" />
          <div className="form-text">Slug: {slugify(title || 'untitled')}</div>
        </div>

        <div className="mb-3">
          <label htmlFor="course-description" className="form-label">
            Description
          </label>
          <textarea
            id="course-description"
            className={`form-control${fieldErrors.description ? ' is-invalid' : ''}`}
            rows={3}
            maxLength={999}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
          <FieldError errors={fieldErrors} field="description" />
        </div>

        <div className="row g-3 mb-3">
          <div className="col-md-6">
            <LanguageSelect
              id="course-language"
              label="Language being taught"
              value={language}
              onChange={setLanguage}
              required
            />
            <FieldError errors={fieldErrors} field="language" />
            <div className="form-text">Stored as ISO 639-3: {language}</div>
          </div>
          <div className="col-md-6">
            <LanguageSelect
              id="course-instruction-language"
              label="Language of instruction"
              value={instructionLanguage}
              onChange={setInstructionLanguage}
              required
            />
            <FieldError errors={fieldErrors} field="instructionLanguage" />
            <div className="form-text">
              Stored as ISO 639-3: {instructionLanguage}
            </div>
          </div>
        </div>

        <div className="row g-3 align-items-end mb-4">
          <div className="col-md-3">
            <label htmlFor="course-version" className="form-label">
              Version
            </label>
            <input
              id="course-version"
              type="number"
              min={1}
              className={`form-control${fieldErrors.version ? ' is-invalid' : ''}`}
              value={version}
              onChange={(event) => setVersion(Number(event.target.value))}
            />
            <FieldError errors={fieldErrors} field="version" />
          </div>
          <div className="col-md-9">
            <div className="form-check form-switch">
              <input
                id="course-published"
                type="checkbox"
                className="form-check-input"
                checked={inProduction}
                onChange={(event) => setInProduction(event.target.checked)}
              />
              <label className="form-check-label" htmlFor="course-published">
                Published — visible to students
              </label>
            </div>
            <div className="form-text">
              Preview drafts with the student link using <code>?preview=1</code>.
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
          {initial ? (
            <span className="ms-auto small text-secondary align-self-center">
              Current language: {languageLabel(initial.language)}
            </span>
          ) : null}
        </div>
      </div>
    </form>
  )
}
