import { useMemo, useState, type FormEvent } from 'react'
import type { BulkQuestionInput } from '../../db/questionsRepo'
import { parseBatchQuestions } from '../../db/validation'
import { ErrorAlert } from '../common/ErrorAlert'

const EXAMPLE = `"Hän puhuu suomea hyvin","He speaks Finnish well"
"Teidän täytyy puhua hiljempaa.","You need to speak more quietly."`

export function BatchQuestionForm({
  onSubmit,
}: {
  onSubmit: (rows: BulkQuestionInput[]) => Promise<number>
}) {
  const [text, setText] = useState('')
  const [error, setError] = useState<unknown>(null)
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)

  const parsed = useMemo(() => parseBatchQuestions(text), [text])

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setBusy(true)
    setError(null)
    setMessage('')

    try {
      const count = await onSubmit(parsed.rows)
      setMessage(`Added ${count} ${count === 1 ? 'question' : 'questions'}.`)
      setText('')
    } catch (caught) {
      setError(caught)
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card border-0 shadow-sm">
      <div className="card-body p-4">
        <h2 className="h5">Batch add sentences</h2>
        <p className="text-secondary small">
          One sentence per line in the form{' '}
          <code>&quot;foreign phrase&quot;,&quot;native phrase&quot;</code>. Comma and
          tab separated CSV are accepted.
        </p>
        <ErrorAlert error={error} />
        {message ? (
          <div className="alert alert-success" role="status">
            {message}
          </div>
        ) : null}

        <label htmlFor="batch-questions" className="form-label">
          Sentences
        </label>
        <textarea
          id="batch-questions"
          className="form-control font-monospace"
          rows={8}
          value={text}
          placeholder={EXAMPLE}
          onChange={(event) => setText(event.target.value)}
        />

        {parsed.errors.length > 0 ? (
          <div className="alert alert-warning mt-3 mb-0" role="alert">
            <strong>Problems found:</strong>
            <ul className="mb-0 mt-1">
              {parsed.errors.slice(0, 8).map((message) => (
                <li key={message}>{message}</li>
              ))}
            </ul>
          </div>
        ) : null}

        {parsed.rows.length > 0 ? (
          <div className="mt-3">
            <div className="small text-secondary mb-1">
              Preview ({parsed.rows.length} rows)
            </div>
            <div className="table-responsive border rounded">
              <table className="table table-sm mb-0">
                <thead>
                  <tr>
                    <th>Foreign</th>
                    <th>Native</th>
                  </tr>
                </thead>
                <tbody>
                  {parsed.rows.slice(0, 6).map((row, index) => (
                    <tr key={`${row.foreignPhrase}-${index}`}>
                      <td>{row.foreignPhrase}</td>
                      <td>{row.nativePhrase}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {parsed.rows.length > 6 ? (
              <div className="small text-secondary mt-1">
                …and {parsed.rows.length - 6} more.
              </div>
            ) : null}
          </div>
        ) : null}

        <button
          type="submit"
          className="btn btn-kuku mt-3"
          disabled={busy || parsed.rows.length === 0 || parsed.errors.length > 0}
        >
          {busy ? (
            <span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />
          ) : null}
          Add {parsed.rows.length > 0 ? parsed.rows.length : ''} questions
        </button>
      </div>
    </form>
  )
}
