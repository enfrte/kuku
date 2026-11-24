import demoSeed from './seed/demoCourse.json'
import { type Flag, db } from './db'
import { uniqueSlug } from './slug'

interface SeedCourse {
  title: string
  description: string
  language: string
  instructionLanguage: string
  slug: string
  version: number
  inProduction: Flag
}

interface SeedLesson {
  id: number
  title: string
  description: string
  slug: string
  tutorial: string
  level: number
  inProduction: Flag
}

interface SeedQuestion {
  id: number
  lessonId: number
  nativePhrase: string
  foreignPhrase: string
  alternativeNativePhrases: string[]
  alternativeForeignPhrases: string[]
}

interface SeedFile {
  course: SeedCourse
  lessons: SeedLesson[]
  questions: SeedQuestion[]
}

const seed = demoSeed as SeedFile
export const SEED_MARKER_KEY = 'seedVersion'
export const SEED_VERSION = '1'

/**
 * Inserts a copy of the bundled demo course with fresh IDs.
 * Safe to call on a non-empty database; IDs are remapped.
 */
export async function loadDemoCourse(): Promise<number> {
  return db.transaction(
    'rw',
    [db.courses, db.lessons, db.questions, db.meta],
    async () => {
      const now = Date.now()
      const existingCourses = await db.courses.toArray()
      const courseSlug = uniqueSlug(
        seed.course.slug,
        existingCourses.map((course) => course.slug),
      )

      const courseId = await db.courses.add({
        title: seed.course.title,
        description: seed.course.description,
        language: seed.course.language,
        instructionLanguage: seed.course.instructionLanguage,
        slug: courseSlug,
        version: seed.course.version,
        inProduction: seed.course.inProduction,
        createdAt: now,
        updatedAt: now,
      })

      const existingLessons = await db.lessons
        .where('courseId')
        .equals(courseId)
        .toArray()
      const lessonSlugs = existingLessons.map((lesson) => lesson.slug)
      const lessonIdMap = new Map<number, number>()

      for (const [index, lesson] of seed.lessons.entries()) {
        const slug = uniqueSlug(lesson.slug, lessonSlugs)
        lessonSlugs.push(slug)
        const newLessonId = await db.lessons.add({
          courseId,
          title: lesson.title,
          description: lesson.description,
          slug,
          tutorial: lesson.tutorial,
          level: lesson.level,
          inProduction: lesson.inProduction,
          createdAt: now + index,
          updatedAt: now + index,
        })
        lessonIdMap.set(lesson.id, newLessonId)
      }

      for (const [index, question] of seed.questions.entries()) {
        const lessonId = lessonIdMap.get(question.lessonId)
        if (!lessonId) continue

        await db.questions.add({
          lessonId,
          nativePhrase: question.nativePhrase,
          foreignPhrase: question.foreignPhrase,
          alternativeNativePhrases: question.alternativeNativePhrases,
          alternativeForeignPhrases: question.alternativeForeignPhrases,
          createdAt: now + index,
          updatedAt: now + index,
        })
      }

      await db.meta.put({ key: SEED_MARKER_KEY, value: SEED_VERSION })
      return courseId
    },
  )
}

export async function ensureSeeded(): Promise<void> {
  const marker = await db.meta.get(SEED_MARKER_KEY)
  if (marker) return

  const courseCount = await db.courses.count()
  if (courseCount === 0) {
    await loadDemoCourse()
  } else {
    await db.meta.put({ key: SEED_MARKER_KEY, value: SEED_VERSION })
  }
}
