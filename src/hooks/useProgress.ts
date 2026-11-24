import { useLiveQuery } from 'dexie-react-hooks'
import {
  type LessonResultInput,
  getLessonProgress,
  markLessonStarted,
  recordLessonResult,
  resetLessonProgress,
} from '../db/progressRepo'

export function useLessonProgress(lessonId: number | undefined) {
  const result = useLiveQuery(async () => {
    if (lessonId === undefined || Number.isNaN(lessonId)) {
      return { progress: undefined }
    }
    return { progress: await getLessonProgress(lessonId) }
  }, [lessonId])

  return {
    progress: result?.progress,
    isLoading: result === undefined,
    markLessonStarted: (courseId: number) =>
      lessonId === undefined
        ? Promise.resolve()
        : markLessonStarted(courseId, lessonId),
    recordLessonResult: (input: LessonResultInput) => recordLessonResult(input),
    resetLessonProgress: () =>
      lessonId === undefined ? Promise.resolve() : resetLessonProgress(lessonId),
  }
}
