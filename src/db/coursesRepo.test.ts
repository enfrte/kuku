import { beforeEach, describe, expect, it } from 'vitest'
import {
  createCourse,
  deleteCourse,
  getCourse,
  listCourses,
  toggleCoursePublished,
  updateCourse,
} from '../db/coursesRepo'
import { createLesson } from '../db/lessonsRepo'
import { createQuestion } from '../db/questionsRepo'
import { markLessonStarted } from '../db/progressRepo'
import { ValidationError } from '../db/errors'
import { db } from '../db/db'
import { makeCourse, resetDb } from '../test/helpers'

describe('coursesRepo', () => {
  beforeEach(resetDb)

  it('creates a course with defaults and a slug', async () => {
    const id = await createCourse({
      title: '  Swedish   basics  ',
      description: ' Learn ',
      language: 'swe',
      instructionLanguage: 'eng',
    })

    const course = await getCourse(id)
    expect(course).toMatchObject({
      id,
      title: 'Swedish basics',
      description: 'Learn',
      language: 'swe',
      instructionLanguage: 'eng',
      slug: 'swedish-basics',
      version: 1,
      inProduction: 0,
    })
    expect(course?.createdAt).toBeGreaterThan(0)
  })

  it('validates required fields and known languages', async () => {
    await expect(
      createCourse({
        title: '',
        language: 'swe',
        instructionLanguage: 'eng',
      }),
    ).rejects.toBeInstanceOf(ValidationError)

    await expect(
      createCourse({
        title: 'Test',
        language: 'xxx',
        instructionLanguage: 'eng',
      }),
    ).rejects.toMatchObject({
      fieldErrors: { language: expect.stringContaining('ISO 639-3') },
    })
  })

  it('makes slugs unique', async () => {
    const first = await makeCourse({ title: 'Same title' })
    const second = await makeCourse({ title: 'Same title' })

    expect((await getCourse(first))?.slug).toBe('same-title')
    expect((await getCourse(second))?.slug).toBe('same-title-2')
  })

  it('filters unpublished courses and searches by title', async () => {
    await makeCourse({ title: 'Published Swedish', inProduction: 1 })
    await makeCourse({ title: 'Draft Finnish', language: 'fin', inProduction: 0 })

    const published = await listCourses()
    expect(published.map((course) => course.title)).toEqual(['Published Swedish'])

    const all = await listCourses({ includeUnpublished: true })
    expect(all).toHaveLength(2)

    const search = await listCourses({ includeUnpublished: true, search: 'finnish' })
    expect(search.map((course) => course.title)).toEqual(['Draft Finnish'])
  })

  it('updates a course and regenerates the slug', async () => {
    const id = await makeCourse({ title: 'Old title' })

    await updateCourse(id, {
      title: 'New title',
      description: 'Updated',
      language: 'swe',
      instructionLanguage: 'eng',
      version: 2,
      inProduction: 1,
    })

    const course = await getCourse(id)
    expect(course).toMatchObject({
      title: 'New title',
      slug: 'new-title',
      version: 2,
      inProduction: 1,
    })
  })

  it('toggles publication', async () => {
    const id = await makeCourse({ inProduction: 0 })
    await toggleCoursePublished(id)
    expect((await getCourse(id))?.inProduction).toBe(1)
    await toggleCoursePublished(id)
    expect((await getCourse(id))?.inProduction).toBe(0)
  })

  it('cascades deletes to lessons, questions, and progress', async () => {
    const courseId = await makeCourse()
    const lessonId = await createLesson(courseId, {
      title: 'People',
      level: 1,
      inProduction: 1,
    })
    await createQuestion(lessonId, {
      nativePhrase: 'I',
      foreignPhrase: 'jag',
    })
    await markLessonStarted(courseId, lessonId)

    await deleteCourse(courseId)

    expect(await db.courses.count()).toBe(0)
    expect(await db.lessons.count()).toBe(0)
    expect(await db.questions.count()).toBe(0)
    expect(await db.progress.count()).toBe(0)
  })
})
