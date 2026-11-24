import { beforeEach, describe, expect, it } from 'vitest'
import {
  createLesson,
  deleteLesson,
  getLesson,
  listLessons,
  updateLesson,
} from '../db/lessonsRepo'
import { createQuestion } from '../db/questionsRepo'
import { markLessonStarted, recordLessonResult } from '../db/progressRepo'
import { db } from '../db/db'
import { makeCourse, makeLesson, resetDb } from '../test/helpers'

describe('lessonsRepo', () => {
  beforeEach(resetDb)

  it('creates lessons scoped to a course', async () => {
    const courseId = await makeCourse()
    const id = await makeLesson(courseId, {
      title: '  Family  ',
      description: ' Relatives ',
      level: 2,
    })

    const lesson = await getLesson(id)
    expect(lesson).toMatchObject({
      courseId,
      title: 'Family',
      description: 'Relatives',
      slug: 'family',
      level: 2,
      inProduction: 1,
    })
  })

  it('rejects a missing course', async () => {
    await expect(
      createLesson(999, { title: 'Nope', level: 1 }),
    ).rejects.toMatchObject({ fieldErrors: { form: 'Course not found.' } })
  })

  it('filters unpublished lessons and sorts by level then title', async () => {
    const courseId = await makeCourse()
    await makeLesson(courseId, { title: 'B lesson', level: 2 })
    await makeLesson(courseId, { title: 'A lesson', level: 2 })
    await makeLesson(courseId, { title: 'Draft', level: 1, inProduction: 0 })

    const published = await listLessons(courseId)
    expect(published.map((lesson) => lesson.title)).toEqual(['A lesson', 'B lesson'])

    const all = await listLessons(courseId, { includeUnpublished: true })
    expect(all.map((lesson) => lesson.title)).toEqual([
      'Draft',
      'A lesson',
      'B lesson',
    ])
  })

  it('includes question counts and progress stats', async () => {
    const courseId = await makeCourse()
    const lessonId = await makeLesson(courseId)
    await createQuestion(lessonId, { nativePhrase: 'I', foreignPhrase: 'jag' })
    await createQuestion(lessonId, { nativePhrase: 'you', foreignPhrase: 'du' })
    await markLessonStarted(courseId, lessonId)
    await recordLessonResult({ courseId, lessonId, correct: 2, total: 2 })

    const [lesson] = await listLessons(courseId)
    expect(lesson.questionCount).toBe(2)
    expect(lesson.bestScore).toBe(100)
    expect(lesson.completedAt).toBeGreaterThan(0)
  })

  it('updates a lesson and regenerates the slug', async () => {
    const courseId = await makeCourse()
    const id = await makeLesson(courseId, { title: 'Old' })

    await updateLesson(id, { title: 'New', description: 'Desc', level: 3 })

    expect(await getLesson(id)).toMatchObject({
      title: 'New',
      slug: 'new',
      description: 'Desc',
      level: 3,
    })
  })

  it('cascades deletes to questions and progress', async () => {
    const courseId = await makeCourse()
    const lessonId = await makeLesson(courseId)
    await createQuestion(lessonId, { nativePhrase: 'I', foreignPhrase: 'jag' })
    await markLessonStarted(courseId, lessonId)

    await deleteLesson(lessonId)

    expect(await db.lessons.count()).toBe(0)
    expect(await db.questions.count()).toBe(0)
    expect(await db.progress.count()).toBe(0)
  })
})
