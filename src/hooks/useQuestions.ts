import { useLiveQuery } from 'dexie-react-hooks'
import {
  type BulkQuestionInput,
  type QuestionInput,
  bulkCreateQuestions,
  createQuestion,
  deleteQuestion,
  listQuestions,
  updateQuestion,
} from '../db/questionsRepo'

export function useQuestions(lessonId: number | undefined) {
  const questions = useLiveQuery(async () => {
    if (lessonId === undefined || Number.isNaN(lessonId)) return []
    return listQuestions(lessonId)
  }, [lessonId])

  return {
    questions,
    isLoading: questions === undefined,
    createQuestion: (input: QuestionInput) =>
      lessonId === undefined
        ? Promise.reject(new Error('Lesson id is required.'))
        : createQuestion(lessonId, input),
    updateQuestion: (id: number, input: QuestionInput) => updateQuestion(id, input),
    deleteQuestion: (id: number) => deleteQuestion(id),
    bulkCreateQuestions: (rows: BulkQuestionInput[]) =>
      lessonId === undefined
        ? Promise.reject(new Error('Lesson id is required.'))
        : bulkCreateQuestions(lessonId, rows),
  }
}
