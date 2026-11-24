import { type Course, type Flag, db } from './db'
import { ValidationError } from './errors'
import { slugify, uniqueSlug } from './slug'
import {
  assertInteger,
  assertLanguage,
  assertMaxLength,
  assertRequired,
  normalizeWhitespace,
  throwIfErrors,
} from './validation'

export interface CourseInput {
  title: string
  description?: string
  language: string
  instructionLanguage: string
  version?: number
  inProduction?: Flag
}

export interface CourseListItem extends Course {
  lessonCount: number
  completedLessonCount: number
}

export interface ListCoursesOptions {
  includeUnpublished?: boolean
  search?: string
}

export async function getCourse(id: number): Promise<Course | undefined> {
  return db.courses.get(id)
}

export async function listCourses(
  options: ListCoursesOptions = {},
): Promise<CourseListItem[]> {
  const { includeUnpublished = false, search = '' } = options

  const courses = includeUnpublished
    ? await db.courses.toArray()
    : await db.courses.where('inProduction').equals(1).toArray()

  const needle = search.trim().toLowerCase()
  const filtered = needle
    ? courses.filter(
        (course) =>
          course.title.toLowerCase().includes(needle) ||
          course.description.toLowerCase().includes(needle) ||
          course.slug.toLowerCase().includes(needle),
      )
    : courses

  const withStats = await Promise.all(
    filtered.map(async (course) => {
      const lessons = await db.lessons.where('courseId').equals(course.id!).toArray()
      const visibleLessons = includeUnpublished
        ? lessons
        : lessons.filter((lesson) => lesson.inProduction === 1)
      const progress = await db.progress.where('courseId').equals(course.id!).toArray()
      const completedLessonIds = new Set(
        progress.filter((item) => item.completedAt).map((item) => item.lessonId),
      )
      const completedLessonCount = visibleLessons.filter((lesson) =>
        completedLessonIds.has(lesson.id!),
      ).length

      return {
        ...course,
        lessonCount: visibleLessons.length,
        completedLessonCount,
      }
    }),
  )

  return withStats.sort((a, b) => a.title.localeCompare(b.title, 'en'))
}

function normalizeCourseInput(input: CourseInput): CourseInput {
  return {
    title: normalizeWhitespace(input.title),
    description: normalizeWhitespace(input.description ?? ''),
    language: input.language.trim(),
    instructionLanguage: input.instructionLanguage.trim(),
    version: input.version ?? 1,
    inProduction: input.inProduction ?? 0,
  }
}

function validateCourseInput(input: CourseInput): void {
  const errors: Record<string, string> = {}
  assertRequired(errors, 'title', 'Title', input.title)
  assertMaxLength(errors, 'title', 'Title', input.title, 255)
  assertMaxLength(errors, 'description', 'Description', input.description ?? '', 999)
  assertLanguage(errors, 'language', 'Course language', input.language)
  assertLanguage(
    errors,
    'instructionLanguage',
    'Instruction language',
    input.instructionLanguage,
  )
  assertInteger(errors, 'version', 'Version', input.version ?? 1, 1)
  throwIfErrors(errors)
}

async function courseSlug(title: string, excludeId?: number): Promise<string> {
  const existing = await db.courses.toArray()
  const slugs = existing
    .filter((course) => course.id !== excludeId)
    .map((course) => course.slug)
  return uniqueSlug(slugify(title), slugs)
}

export async function createCourse(input: CourseInput): Promise<number> {
  const normalized = normalizeCourseInput(input)
  validateCourseInput(normalized)

  return db.transaction('rw', db.courses, async () => {
    const now = Date.now()
    return db.courses.add({
      ...normalized,
      description: normalized.description ?? '',
      version: normalized.version ?? 1,
      inProduction: normalized.inProduction ?? 0,
      slug: await courseSlug(normalized.title),
      createdAt: now,
      updatedAt: now,
    })
  })
}

export async function updateCourse(id: number, input: CourseInput): Promise<void> {
  const normalized = normalizeCourseInput(input)
  validateCourseInput(normalized)

  await db.transaction('rw', db.courses, async () => {
    const existing = await db.courses.get(id)
    if (!existing) throw new ValidationError({ form: 'Course not found.' })

    const slug =
      existing.title === normalized.title
        ? existing.slug
        : await courseSlug(normalized.title, id)

    await db.courses.update(id, {
      ...normalized,
      description: normalized.description ?? '',
      version: normalized.version ?? 1,
      inProduction: normalized.inProduction ?? 0,
      slug,
      updatedAt: Date.now(),
    })
  })
}

export async function toggleCoursePublished(id: number): Promise<void> {
  await db.transaction('rw', db.courses, async () => {
    const course = await db.courses.get(id)
    if (!course) return
    await db.courses.update(id, {
      inProduction: course.inProduction === 1 ? 0 : 1,
      updatedAt: Date.now(),
    })
  })
}

export async function deleteCourse(id: number): Promise<void> {
  await db.transaction(
    'rw',
    [db.courses, db.lessons, db.questions, db.progress],
    async () => {
      const lessonIds = (await db.lessons
        .where('courseId')
        .equals(id)
        .primaryKeys()) as number[]

      if (lessonIds.length > 0) {
        await db.questions.where('lessonId').anyOf(lessonIds).delete()
      }
      await db.progress.where('courseId').equals(id).delete()
      await db.lessons.where('courseId').equals(id).delete()
      await db.courses.delete(id)
    },
  )
}
