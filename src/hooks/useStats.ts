import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db/db'

export interface DatabaseStats {
  courses: number
  lessons: number
  questions: number
  completedLessons: number
}

export function useStats() {
  const stats = useLiveQuery(async () => {
    const [courses, lessons, questions, progress] = await Promise.all([
      db.courses.count(),
      db.lessons.count(),
      db.questions.count(),
      db.progress.toArray(),
    ])

    return {
      courses,
      lessons,
      questions,
      completedLessons: progress.filter((item) => item.completedAt).length,
    }
  }, [])

  return {
    stats,
    isLoading: stats === undefined,
  }
}
