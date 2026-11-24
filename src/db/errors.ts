export class ValidationError extends Error {
  readonly fieldErrors: Record<string, string>

  constructor(fieldErrors: Record<string, string>) {
    super('Please fix the highlighted fields.')
    this.name = 'ValidationError'
    this.fieldErrors = fieldErrors
  }
}

export function isValidationError(error: unknown): error is ValidationError {
  return error instanceof ValidationError
}
