import { useLiveQuery } from 'dexie-react-hooks'
import {
  type CourseInput,
  type CourseListItem,
  type ListCoursesOptions,
  createCourse,
  deleteCourse,
  listCourses,
  toggleCoursePublished,
  updateCourse,
} from '../db/coursesRepo'

export function useCourses(options: ListCoursesOptions = {}) {
  const includeUnpublished = options.includeUnpublished ?? false
  const search = options.search ?? ''

  const courses = useLiveQuery(
    () => listCourses({ includeUnpublished, search }),
    [includeUnpublished, search],
  ) as CourseListItem[] | undefined

  return {
    courses,
    isLoading: courses === undefined,
    createCourse: (input: CourseInput) => createCourse(input),
    updateCourse: (id: number, input: CourseInput) => updateCourse(id, input),
    deleteCourse: (id: number) => deleteCourse(id),
    toggleCoursePublished: (id: number) => toggleCoursePublished(id),
  }
}
