import { beforeEach, describe, expect, it } from 'vitest'
import { exportAll, importAll, resetAll } from '../db/backupRepo'
import { createQuestion } from '../db/questionsRepo'
import { recordLessonResult } from '../db/progressRepo'
import { db } from '../db/db'
import { makeCourse, makeLesson, resetDb } from '../test/helpers'

describe('backupRepo', () => {
  beforeEach(resetDb)

  it('exports and restores all tables', async () => {
    const courseId = await makeCourse()
    const lessonId = await makeLesson(courseId)
    await createQuestion(lessonId, { nativePhrase: 'I', foreignPhrase: 'jag' })
    await recordLessonResult({ courseId, lessonId, correct: 1, total: 1 })

    const backup = await exportAll()
    expect(backup).toMatchObject({ app: 'kuku', schemaVersion: 1 })
    expect(backup.data.courses).toHaveLength(1)
    expect(backup.data.lessons).toHaveLength(1)
    expect(backup.data.questions).toHaveLength(1)
    expect(backup.data.progress).toHaveLength(1)

    await resetAll()
    expect(await db.courses.count()).toBe(0)
    expect(await db.lessons.count()).toBe(0)

    await importAll(backup)
    expect(await db.courses.count()).toBe(1)
    expect(await db.lessons.count()).toBe(1)
    expect(await db.questions.count()).toBe(1)
    expect(await db.progress.count()).toBe(1)
  })

  it('rejects invalid backups', async () => {
    await expect(importAll({})).rejects.toMatchObject({
      fieldErrors: { file: expect.stringContaining('not a kuku backup') },
    })
    await expect(
      importAll({ app: 'kuku', schemaVersion: 99, data: {} }),
    ).rejects.toMatchObject({
      fieldErrors: { file: expect.stringContaining('Unsupported') },
    })
  })

  it('preserves a seed marker after import when missing', async () => {
    const backup = await exportAll()
    backup.data.meta = []

    await importAll(backup)
    expect(await db.meta.get('seedVersion')).toBeDefined()
  })
})
