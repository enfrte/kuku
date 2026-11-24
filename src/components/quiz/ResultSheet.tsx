export function ResultSheet({
  correct,
  answer,
  isLast,
  onContinue,
}: {
  correct: boolean
  answer: string
  isLast: boolean
  onContinue: () => void
}) {
  return (
    <div
      className={`result-sheet text-white ${correct ? 'bg-kuku' : 'bg-danger'}`}
      role="status"
      aria-live="polite"
    >
      <div className="container app-container py-3 d-flex flex-column flex-md-row align-items-md-center gap-2">
        <div className="flex-grow-1">
          <h2 className="h4 mb-1">{correct ? 'Correct!' : 'Not quite'}</h2>
          <p className="mb-0">
            {correct ? answer : `Correct answer: ${answer}`}
          </p>
        </div>
        <button type="button" className="btn btn-light btn-lg" onClick={onContinue}>
          {isLast ? 'Finish' : 'Continue'}
        </button>
      </div>
    </div>
  )
}
