import { beforeEach, describe, expect, it } from 'vitest'
import {
  getLessonProgress,
  markLessonStarted,
  recordLessonResult,
  resetLessonProgress,
} from '../db/progressRepo'
import { db } from '../db/db'
import { makeCourse, makeLesson, resetDb } from '../test/helpers'

describe('progressRepo', () => {
  beforeEach(resetDb)

  it('creates a progress row when a lesson starts', async () => {
    const courseId = await makeCourse()
    const lessonId = await makeLesson(courseId)

    await markLessonStarted(courseId, lessonId)

    const progress = await getLessonProgress(lessonId)
    expect(progress).toMatchObject({
      courseId,
      lessonId,
      attempts: 0,
      bestScore: 0,
      lastPlayedAt: expect.any(Number),
    })
  })

  it('tracks attempts and best score', async () => {
    const courseId = await makeCourse()
    const lessonId = await makeLesson(courseId)

    await recordLessonResult({ courseId, lessonId, correct: 2, total: 4 })
    await recordLessonResult({ courseId, lessonId, correct: 3, total: 4 })
    await recordLessonResult({ courseId, lessonId, correct: 1, total: 4 })

    const progress = await getLessonProgress(lessonId)
    expect(progress?.attempts).toBe(3)
    expect(progress?.bestScore).toBe(75)
    expect(progress?.completedAt).toBeGreaterThan(0)
  })

  it('ignores empty quizzes and resets progress', async () => {
    const courseId = await makeCourse()
    const lessonId = await makeLesson(courseId)

    await recordLessonResult({ courseId, lessonId, correct: 0, total: 0 })
    expect(await db.progress.count()).toBe(0)

    await recordLessonResult({ courseId, lessonId, correct: 1, total: 1 })
    await resetLessonProgress(lessonId)
    expect(await getLessonProgress(lessonId)).toBeUndefined()
  })
})
