import { useLiveQuery } from 'dexie-react-hooks'
import {
  type LessonInput,
  type LessonListItem,
  type ListLessonsOptions,
  createLesson,
  deleteLesson,
  listLessons,
  toggleLessonPublished,
  updateLesson,
} from '../db/lessonsRepo'

export function useLessons(
  courseId: number | undefined,
  options: ListLessonsOptions = {},
) {
  const includeUnpublished = options.includeUnpublished ?? false

  const lessons = useLiveQuery(async () => {
    if (courseId === undefined || Number.isNaN(courseId)) return []
    return listLessons(courseId, { includeUnpublished })
  }, [courseId, includeUnpublished]) as LessonListItem[] | undefined

  return {
    lessons,
    isLoading: lessons === undefined,
    createLesson: (input: LessonInput) =>
      courseId === undefined
        ? Promise.reject(new Error('Course id is required.'))
        : createLesson(courseId, input),
    updateLesson: (id: number, input: LessonInput) => updateLesson(id, input),
    deleteLesson: (id: number) => deleteLesson(id),
    toggleLessonPublished: (id: number) => toggleLessonPublished(id),
  }
}
