import { useLiveQuery } from 'dexie-react-hooks'
import {
  type LessonInput,
  deleteLesson,
  getLesson,
  toggleLessonPublished,
  updateLesson,
} from '../db/lessonsRepo'

export function useLesson(id: number | undefined) {
  const result = useLiveQuery(async () => {
    if (id === undefined || Number.isNaN(id)) return { lesson: undefined }
    return { lesson: await getLesson(id) }
  }, [id])

  return {
    lesson: result?.lesson,
    isLoading: result === undefined,
    notFound: result !== undefined && result.lesson === undefined,
    updateLesson: (input: LessonInput) =>
      id === undefined ? Promise.resolve() : updateLesson(id, input),
    deleteLesson: () => (id === undefined ? Promise.resolve() : deleteLesson(id)),
    toggleLessonPublished: () =>
      id === undefined ? Promise.resolve() : toggleLessonPublished(id),
  }
}
