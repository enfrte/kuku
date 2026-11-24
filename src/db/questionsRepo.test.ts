import { beforeEach, describe, expect, it } from 'vitest'
import {
  bulkCreateQuestions,
  createQuestion,
  deleteQuestion,
  listQuestions,
  updateQuestion,
} from '../db/questionsRepo'
import { ValidationError } from '../db/errors'
import { db } from '../db/db'
import { makeCourse, makeLesson, resetDb } from '../test/helpers'

describe('questionsRepo', () => {
  beforeEach(resetDb)

  it('normalizes phrases and alternative lines', async () => {
    const courseId = await makeCourse()
    const lessonId = await makeLesson(courseId)

    const id = await createQuestion(lessonId, {
      nativePhrase: '  the   uncle ',
      foreignPhrase: ' farbrodern,  morbrodern ',
      alternativeNativePhrases: 'the uncle\n\nthe relative',
      alternativeForeignPhrases: 'morbrodern, farbrodern',
    })

    const [question] = await listQuestions(lessonId)
    expect(question).toMatchObject({
      id,
      nativePhrase: 'the uncle',
      foreignPhrase: 'farbrodern, morbrodern',
      alternativeNativePhrases: ['the uncle', 'the relative'],
      alternativeForeignPhrases: ['morbrodern, farbrodern'],
    })
  })

  it('validates required phrases and length', async () => {
    const courseId = await makeCourse()
    const lessonId = await makeLesson(courseId)

    await expect(
      createQuestion(lessonId, { nativePhrase: '', foreignPhrase: 'jag' }),
    ).rejects.toBeInstanceOf(ValidationError)

    await expect(
      createQuestion(lessonId, {
        nativePhrase: 'x'.repeat(601),
        foreignPhrase: 'jag',
      }),
    ).rejects.toMatchObject({
      fieldErrors: { nativePhrase: expect.stringContaining('600') },
    })
  })

  it('bulk creates questions in one transaction', async () => {
    const courseId = await makeCourse()
    const lessonId = await makeLesson(courseId)

    const count = await bulkCreateQuestions(lessonId, [
      { foreignPhrase: 'jag', nativePhrase: 'I' },
      { foreignPhrase: 'du', nativePhrase: 'you' },
      { foreignPhrase: 'han', nativePhrase: 'he' },
    ])

    expect(count).toBe(3)
    expect(await db.questions.where('lessonId').equals(lessonId).count()).toBe(3)
    const questions = await listQuestions(lessonId)
    expect(questions.map((question) => question.foreignPhrase)).toEqual([
      'jag',
      'du',
      'han',
    ])
  })

  it('updates and deletes a question', async () => {
    const courseId = await makeCourse()
    const lessonId = await makeLesson(courseId)
    const id = await createQuestion(lessonId, {
      nativePhrase: 'I',
      foreignPhrase: 'jag',
    })

    await updateQuestion(id, {
      nativePhrase: 'me',
      foreignPhrase: 'mig',
      alternativeForeignPhrases: 'mig själv',
    })

    let [question] = await listQuestions(lessonId)
    expect(question).toMatchObject({
      nativePhrase: 'me',
      foreignPhrase: 'mig',
      alternativeForeignPhrases: ['mig själv'],
    })

    await deleteQuestion(id)
    expect(await listQuestions(lessonId)).toEqual([])
  })
})
