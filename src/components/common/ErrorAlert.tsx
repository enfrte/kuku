import { isValidationError } from '../../db/errors'

export function ErrorAlert({ error }: { error: unknown }) {
  if (!error) return null

  if (isValidationError(error)) {
    const entries = Object.entries(error.fieldErrors)
    return (
      <div className="alert alert-danger" role="alert">
        <strong>{error.message}</strong>
        {entries.length > 0 ? (
          <ul className="mb-0 mt-2">
            {entries.map(([field, message]) => (
              <li key={field}>
                {field === 'form' || field === 'file' ? message : `${field}: ${message}`}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    )
  }

  const message = error instanceof Error ? error.message : String(error)
  return (
    <div className="alert alert-danger" role="alert">
      {message}
    </div>
  )
}

export function FieldError({
  errors,
  field,
}: {
  errors: Record<string, string>
  field: string
}) {
  if (!errors[field]) return null
  return <div className="invalid-feedback d-block">{errors[field]}</div>
}
