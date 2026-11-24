import { db } from '../db/db'
import { createCourse } from '../db/coursesRepo'
import { createLesson } from '../db/lessonsRepo'

export async function resetDb(): Promise<void> {
  db.close()
  await db.delete()
  await db.open()
}

export async function makeCourse(overrides: Partial<Parameters<typeof createCourse>[0]> = {}) {
  return createCourse({
    title: 'Swedish basics',
    description: 'A test course',
    language: 'swe',
    instructionLanguage: 'eng',
    inProduction: 1,
    ...overrides,
  })
}

export async function makeLesson(
  courseId: number,
  overrides: Partial<Parameters<typeof createLesson>[1]> = {},
) {
  return createLesson(courseId, {
    title: 'People',
    level: 1,
    inProduction: 1,
    ...overrides,
  })
}
