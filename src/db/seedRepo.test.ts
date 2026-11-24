import { beforeEach, describe, expect, it } from 'vitest'
import { ensureSeeded, loadDemoCourse } from '../db/seedRepo'
import { db } from '../db/db'
import { resetDb } from '../test/helpers'

describe('seedRepo', () => {
  beforeEach(resetDb)

  it('seeds the demo course once', async () => {
    await ensureSeeded()

    const course = await db.courses.toCollection().first()
    expect(course?.title).toBe('100 Swedish Lessons')
    expect(course?.language).toBe('swe')
    expect(await db.lessons.count()).toBe(10)
    expect(await db.questions.count()).toBe(176)
    expect(await db.meta.get('seedVersion')).toEqual({
      key: 'seedVersion',
      value: '1',
    })

    await ensureSeeded()
    expect(await db.courses.count()).toBe(1)
  })

  it('does not re-seed after the content is deleted', async () => {
    await ensureSeeded()
    await db.courses.clear()
    await db.lessons.clear()
    await db.questions.clear()

    await ensureSeeded()
    expect(await db.courses.count()).toBe(0)
  })

  it('can add another demo copy with remapped IDs', async () => {
    const firstCourseId = await loadDemoCourse()
    const secondCourseId = await loadDemoCourse()

    expect(secondCourseId).not.toBe(firstCourseId)
    expect(await db.courses.count()).toBe(2)
    expect(await db.lessons.count()).toBe(20)
    expect(await db.questions.count()).toBe(352)

    const secondLessons = await db.lessons
      .where('courseId')
      .equals(secondCourseId)
      .toArray()
    const secondLessonIds = new Set(secondLessons.map((lesson) => lesson.id))
    const secondQuestions = await db.questions
      .where('lessonId')
      .anyOf([...secondLessonIds] as number[])
      .count()
    expect(secondQuestions).toBe(176)
  })
})
