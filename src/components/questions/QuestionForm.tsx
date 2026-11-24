import { useState, type FormEvent } from 'react'
import type { Question } from '../../db/db'
import type { QuestionInput } from '../../db/questionsRepo'
import { isValidationError } from '../../db/errors'
import { ErrorAlert, FieldError } from '../common/ErrorAlert'

function alternativesToText(values: string[]): string {
  return values.join('\n')
}

export function QuestionForm({
  initial,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  initial?: Question
  submitLabel: string
  onSubmit: (input: QuestionInput) => Promise<void>
  onCancel: () => void
}) {
  const [nativePhrase, setNativePhrase] = useState(initial?.nativePhrase ?? '')
  const [foreignPhrase, setForeignPhrase] = useState(initial?.foreignPhrase ?? '')
  const [alternativeNativePhrases, setAlternativeNativePhrases] = useState(
    alternativesToText(initial?.alternativeNativePhrases ?? []),
  )
  const [alternativeForeignPhrases, setAlternativeForeignPhrases] = useState(
    alternativesToText(initial?.alternativeForeignPhrases ?? []),
  )
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
        nativePhrase,
        foreignPhrase,
        alternativeNativePhrases,
        alternativeForeignPhrases,
      })
      if (!initial) {
        setNativePhrase('')
        setForeignPhrase('')
        setAlternativeNativePhrases('')
        setAlternativeForeignPhrases('')
      }
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

        <div className="row g-3">
          <div className="col-md-6">
            <label htmlFor="question-native" className="form-label">
              Native phrase
            </label>
            <input
              id="question-native"
              className={`form-control${fieldErrors.nativePhrase ? ' is-invalid' : ''}`}
              value={nativePhrase}
              maxLength={600}
              onChange={(event) => setNativePhrase(event.target.value)}
              placeholder="the uncle"
              required
            />
            <FieldError errors={fieldErrors} field="nativePhrase" />
          </div>
          <div className="col-md-6">
            <label htmlFor="question-foreign" className="form-label">
              Foreign phrase
            </label>
            <input
              id="question-foreign"
              className={`form-control${fieldErrors.foreignPhrase ? ' is-invalid' : ''}`}
              value={foreignPhrase}
              maxLength={600}
              onChange={(event) => setForeignPhrase(event.target.value)}
              placeholder="farbrodern, morbrodern"
              required
            />
            <FieldError errors={fieldErrors} field="foreignPhrase" />
          </div>
        </div>

        <div className="row g-3 mt-1">
          <div className="col-md-6">
            <label htmlFor="question-alt-native" className="form-label">
              Alternative native phrases
            </label>
            <textarea
              id="question-alt-native"
              className={`form-control${
                fieldErrors.alternativeNativePhrases ? ' is-invalid' : ''
              }`}
              rows={3}
              value={alternativeNativePhrases}
              onChange={(event) => setAlternativeNativePhrases(event.target.value)}
              placeholder="One phrase per line"
            />
            <FieldError errors={fieldErrors} field="alternativeNativePhrases" />
          </div>
          <div className="col-md-6">
            <label htmlFor="question-alt-foreign" className="form-label">
              Alternative foreign phrases
            </label>
            <textarea
              id="question-alt-foreign"
              className={`form-control${
                fieldErrors.alternativeForeignPhrases ? ' is-invalid' : ''
              }`}
              rows={3}
              value={alternativeForeignPhrases}
              onChange={(event) => setAlternativeForeignPhrases(event.target.value)}
              placeholder="One phrase per line"
            />
            <FieldError errors={fieldErrors} field="alternativeForeignPhrases" />
          </div>
        </div>

        <div className="d-flex flex-wrap gap-2 mt-3">
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
