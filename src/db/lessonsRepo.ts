import { type Flag, type Lesson, db } from './db'
import { ValidationError } from './errors'
import { slugify, uniqueSlug } from './slug'
import {
  assertInteger,
  assertMaxLength,
  assertRequired,
  normalizeWhitespace,
  throwIfErrors,
} from './validation'

export interface LessonInput {
  title: string
  description?: string
  tutorial?: string
  level?: number
  inProduction?: Flag
}

export interface LessonListItem extends Lesson {
  questionCount: number
  bestScore: number
  completedAt?: number
  lastPlayedAt?: number
}

export interface ListLessonsOptions {
  includeUnpublished?: boolean
}

export async function getLesson(id: number): Promise<Lesson | undefined> {
  return db.lessons.get(id)
}

export async function listLessons(
  courseId: number,
  options: ListLessonsOptions = {},
): Promise<LessonListItem[]> {
  const { includeUnpublished = false } = options

  const lessons = includeUnpublished
    ? await db.lessons.where('courseId').equals(courseId).toArray()
    : await db.lessons
        .where('[courseId+inProduction]')
        .equals([courseId, 1])
        .toArray()

  const withStats = await Promise.all(
    lessons.map(async (lesson) => {
      const questionCount = await db.questions
        .where('lessonId')
        .equals(lesson.id!)
        .count()
      const progress = await db.progress
        .where('lessonId')
        .equals(lesson.id!)
        .first()

      return {
        ...lesson,
        questionCount,
        bestScore: progress?.bestScore ?? 0,
        completedAt: progress?.completedAt,
        lastPlayedAt: progress?.lastPlayedAt,
      }
    }),
  )

  return withStats.sort(
    (a, b) => a.level - b.level || a.title.localeCompare(b.title, 'en'),
  )
}

function normalizeLessonInput(input: LessonInput): LessonInput {
  return {
    title: normalizeWhitespace(input.title),
    description: normalizeWhitespace(input.description ?? ''),
    tutorial: (input.tutorial ?? '').trim(),
    level: input.level ?? 0,
    inProduction: input.inProduction ?? 0,
  }
}

function validateLessonInput(input: LessonInput): void {
  const errors: Record<string, string> = {}
  assertRequired(errors, 'title', 'Title', input.title)
  assertMaxLength(errors, 'title', 'Title', input.title, 255)
  assertMaxLength(errors, 'description', 'Description', input.description ?? '', 300)
  assertMaxLength(errors, 'tutorial', 'Tutorial', input.tutorial ?? '', 99999)
  assertInteger(errors, 'level', 'Level', input.level ?? 0, 0)
  throwIfErrors(errors)
}

async function lessonSlug(
  courseId: number,
  title: string,
  excludeId?: number,
): Promise<string> {
  const existing = await db.lessons.where('courseId').equals(courseId).toArray()
  const slugs = existing
    .filter((lesson) => lesson.id !== excludeId)
    .map((lesson) => lesson.slug)
  return uniqueSlug(slugify(title), slugs)
}

export async function createLesson(
  courseId: number,
  input: LessonInput,
): Promise<number> {
  const normalized = normalizeLessonInput(input)
  validateLessonInput(normalized)

  return db.transaction('rw', [db.courses, db.lessons], async () => {
    const course = await db.courses.get(courseId)
    if (!course) throw new ValidationError({ form: 'Course not found.' })

    const now = Date.now()
    return db.lessons.add({
      ...normalized,
      courseId,
      description: normalized.description ?? '',
      tutorial: normalized.tutorial ?? '',
      level: normalized.level ?? 0,
      inProduction: normalized.inProduction ?? 0,
      slug: await lessonSlug(courseId, normalized.title),
      createdAt: now,
      updatedAt: now,
    })
  })
}

export async function updateLesson(id: number, input: LessonInput): Promise<void> {
  const normalized = normalizeLessonInput(input)
  validateLessonInput(normalized)

  await db.transaction('rw', db.lessons, async () => {
    const existing = await db.lessons.get(id)
    if (!existing) throw new ValidationError({ form: 'Lesson not found.' })

    const slug =
      existing.title === normalized.title
        ? existing.slug
        : await lessonSlug(existing.courseId, normalized.title, id)

    await db.lessons.update(id, {
      ...normalized,
      description: normalized.description ?? '',
      tutorial: normalized.tutorial ?? '',
      level: normalized.level ?? 0,
      inProduction: normalized.inProduction ?? 0,
      slug,
      updatedAt: Date.now(),
    })
  })
}

export async function toggleLessonPublished(id: number): Promise<void> {
  await db.transaction('rw', db.lessons, async () => {
    const lesson = await db.lessons.get(id)
    if (!lesson) return
    await db.lessons.update(id, {
      inProduction: lesson.inProduction === 1 ? 0 : 1,
      updatedAt: Date.now(),
    })
  })
}

export async function deleteLesson(id: number): Promise<void> {
  await db.transaction(
    'rw',
    [db.lessons, db.questions, db.progress],
    async () => {
      const lesson = await db.lessons.get(id)
      if (!lesson) return

      await db.questions.where('lessonId').equals(id).delete()
      await db.progress.where('lessonId').equals(id).delete()
      await db.lessons.delete(id)
    },
  )
}
