import type { Question } from '../../db/db'

export function QuestionList({
  questions,
  editingId,
  onEdit,
  onDelete,
}: {
  questions: Question[]
  editingId?: number | null
  onEdit: (question: Question) => void
  onDelete: (question: Question) => void
}) {
  return (
    <div className="table-responsive bg-white rounded-4 shadow-sm">
      <table className="table align-middle mb-0">
        <thead>
          <tr>
            <th scope="col">Native</th>
            <th scope="col">Foreign</th>
            <th scope="col">Alternatives</th>
            <th scope="col" className="text-end">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {questions.map((question) => (
            <tr
              key={question.id}
              className={editingId === question.id ? 'table-warning' : undefined}
            >
              <td>{question.nativePhrase}</td>
              <td>{question.foreignPhrase}</td>
              <td className="small text-secondary">
                {question.alternativeNativePhrases.length === 0 &&
                question.alternativeForeignPhrases.length === 0 ? (
                  <span>None</span>
                ) : (
                  <>
                    {question.alternativeNativePhrases.length > 0 ? (
                      <div>
                        <span className="fw-semibold">Native:</span>{' '}
                        {question.alternativeNativePhrases.join(' · ')}
                      </div>
                    ) : null}
                    {question.alternativeForeignPhrases.length > 0 ? (
                      <div>
                        <span className="fw-semibold">Foreign:</span>{' '}
                        {question.alternativeForeignPhrases.join(' · ')}
                      </div>
                    ) : null}
                  </>
                )}
              </td>
              <td className="text-end">
                <div className="d-flex gap-1 justify-content-end">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-dark"
                    onClick={() => onEdit(question)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => onDelete(question)}
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
  )
}
