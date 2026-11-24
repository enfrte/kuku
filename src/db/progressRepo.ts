import { type LessonProgress, db } from './db'
import { ValidationError } from './errors'
import { clampScore } from './validation'

export async function getLessonProgress(
  lessonId: number,
): Promise<LessonProgress | undefined> {
  return db.progress.where('lessonId').equals(lessonId).first()
}

export async function listCourseProgress(
  courseId: number,
): Promise<LessonProgress[]> {
  return db.progress.where('courseId').equals(courseId).toArray()
}

export async function markLessonStarted(
  courseId: number,
  lessonId: number,
): Promise<void> {
  await db.transaction('rw', [db.lessons, db.progress], async () => {
    const lesson = await db.lessons.get(lessonId)
    if (!lesson) throw new ValidationError({ form: 'Lesson not found.' })

    const existing = await db.progress.where('lessonId').equals(lessonId).first()
    const now = Date.now()

    if (existing?.id) {
      await db.progress.update(existing.id, { lastPlayedAt: now })
    } else {
      await db.progress.add({
        courseId,
        lessonId,
        attempts: 0,
        bestScore: 0,
        lastPlayedAt: now,
      })
    }
  })
}

export interface LessonResultInput {
  courseId: number
  lessonId: number
  correct: number
  total: number
}

export async function recordLessonResult(input: LessonResultInput): Promise<void> {
  const { courseId, lessonId, correct, total } = input
  if (total <= 0) return

  await db.transaction('rw', [db.lessons, db.progress], async () => {
    const lesson = await db.lessons.get(lessonId)
    if (!lesson) throw new ValidationError({ form: 'Lesson not found.' })

    const existing = await db.progress.where('lessonId').equals(lessonId).first()
    const now = Date.now()
    const score = clampScore((correct / total) * 100)

    if (existing?.id) {
      await db.progress.update(existing.id, {
        attempts: existing.attempts + 1,
        bestScore: Math.max(existing.bestScore, score),
        completedAt: now,
        lastPlayedAt: now,
      })
    } else {
      await db.progress.add({
        courseId,
        lessonId,
        attempts: 1,
        bestScore: score,
        completedAt: now,
        lastPlayedAt: now,
      })
    }
  })
}

export async function resetLessonProgress(lessonId: number): Promise<void> {
  await db.progress.where('lessonId').equals(lessonId).delete()
}
