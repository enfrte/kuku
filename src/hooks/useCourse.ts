import { useLiveQuery } from 'dexie-react-hooks'
import {
  type CourseInput,
  deleteCourse,
  getCourse,
  toggleCoursePublished,
  updateCourse,
} from '../db/coursesRepo'

export function useCourse(id: number | undefined) {
  const result = useLiveQuery(async () => {
    if (id === undefined || Number.isNaN(id)) return { course: undefined }
    return { course: await getCourse(id) }
  }, [id])

  return {
    course: result?.course,
    isLoading: result === undefined,
    notFound: result !== undefined && result.course === undefined,
    updateCourse: (input: CourseInput) =>
      id === undefined ? Promise.resolve() : updateCourse(id, input),
    deleteCourse: () => (id === undefined ? Promise.resolve() : deleteCourse(id)),
    toggleCoursePublished: () =>
      id === undefined ? Promise.resolve() : toggleCoursePublished(id),
  }
}
