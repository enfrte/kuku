import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../db/db'
import { exportAll, resetAll } from '../db/backupRepo'
import {
  type ContentSnapshot,
  type DeployedContentFile,
  DEPLOYED_CONTENT_HASH_KEY,
  DEPLOYED_CONTENT_VERSION_KEY,
  applyDeployedContent,
  createDeployedContentFile,
  dismissContentUpdate,
  fingerprintContent,
  getCurrentContent,
  getDeployStatus,
  initializeContent,
  markDeployedContentPublished,
  parseDeployedContent,
} from '../db/deployedContentRepo'
import { updateCourse } from '../db/coursesRepo'
import { createQuestion } from '../db/questionsRepo'
import { recordLessonResult } from '../db/progressRepo'
import { makeCourse, makeLesson, resetDb } from '../test/helpers'

function deployedFile(
  content: ContentSnapshot,
  contentVersion: number,
): DeployedContentFile {
  return {
    app: 'kuku',
    kind: 'deployed-content',
    schemaVersion: 1,
    contentVersion,
    updatedAt: new Date().toISOString(),
    contentHash: fingerprintContent(content),
    ...content,
  }
}

async function currentDeployedFile(contentVersion: number) {
  return deployedFile(await getCurrentContent(), contentVersion)
}

const emptyContent: ContentSnapshot = {
  courses: [],
  lessons: [],
  questions: [],
}

describe('deployedContentRepo', () => {
  beforeEach(resetDb)

  it('imports deployed content when the local database is empty', async () => {
    const courseId = await makeCourse()
    const lessonId = await makeLesson(courseId)
    await createQuestion(lessonId, { nativePhrase: 'I', foreignPhrase: 'jag' })
    const deployed = await currentDeployedFile(3)

    await resetDb()

    const result = await initializeContent(deployed)

    expect(result.imported).toBe(true)
    expect(result.seeded).toBe(false)
    expect(result.pendingUpdate).toBeNull()
    expect(await db.courses.count()).toBe(1)
    expect(await db.lessons.count()).toBe(1)
    expect(await db.questions.count()).toBe(1)
    expect(await db.meta.get(DEPLOYED_CONTENT_VERSION_KEY)).toEqual({
      key: DEPLOYED_CONTENT_VERSION_KEY,
      value: '3',
    })
  })

  it('falls back to the demo course when deployed content is empty', async () => {
    await db.meta.put({ key: DEPLOYED_CONTENT_VERSION_KEY, value: '9' })

    const result = await initializeContent(deployedFile(emptyContent, 0))

    expect(result.imported).toBe(false)
    expect(result.seeded).toBe(true)
    expect(result.localVersion).toBe(0)
    expect(await db.courses.count()).toBe(1)
    expect((await db.courses.toCollection().first())?.title).toBe(
      '100 Swedish Lessons',
    )
    expect(await db.meta.get(DEPLOYED_CONTENT_VERSION_KEY)).toEqual({
      key: DEPLOYED_CONTENT_VERSION_KEY,
      value: '0',
    })
  })

  it('offers a newer deployment without changing local content', async () => {
    const courseId = await makeCourse({ title: 'Local course' })
    const deployed = await currentDeployedFile(4)

    const result = await initializeContent(deployed)

    expect(result.pendingUpdate?.contentVersion).toBe(4)
    expect((await db.courses.get(courseId))?.title).toBe('Local course')
  })

  it('does not offer an update when the local version is current or newer', async () => {
    await makeCourse()
    const deployed = await currentDeployedFile(2)
    await db.meta.put({ key: DEPLOYED_CONTENT_VERSION_KEY, value: '2' })

    expect((await initializeContent(deployed)).pendingUpdate).toBeNull()

    await db.meta.put({ key: DEPLOYED_CONTENT_VERSION_KEY, value: '3' })
    expect((await initializeContent(deployed)).pendingUpdate).toBeNull()
  })

  it('respects a dismissed update version', async () => {
    await makeCourse()
    const deployed = await currentDeployedFile(4)

    await dismissContentUpdate(4)
    expect((await initializeContent(deployed)).pendingUpdate).toBeNull()

    const newer = await currentDeployedFile(5)
    expect((await initializeContent(newer)).pendingUpdate?.contentVersion).toBe(5)
  })

  it('replaces content while keeping progress for matching lessons', async () => {
    const courseId = await makeCourse()
    const keepLessonId = await makeLesson(courseId, { title: 'Keep me' })
    const dropLessonId = await makeLesson(courseId, { title: 'Drop me' })
    await recordLessonResult({
      courseId,
      lessonId: keepLessonId,
      correct: 1,
      total: 1,
    })
    await recordLessonResult({
      courseId,
      lessonId: dropLessonId,
      correct: 1,
      total: 1,
    })

    const course = (await db.courses.get(courseId))!
    const keepLesson = (await db.lessons.get(keepLessonId))!
    const deployed = deployedFile(
      {
        courses: [{ ...course, title: 'Updated course' }],
        lessons: [{ ...keepLesson, title: 'Updated lesson' }],
        questions: [],
      },
      5,
    )

    await applyDeployedContent(deployed)

    expect((await db.courses.get(courseId))?.title).toBe('Updated course')
    expect(await db.lessons.count()).toBe(1)
    expect((await db.lessons.get(keepLessonId))?.title).toBe('Updated lesson')
    expect(await db.progress.count()).toBe(1)
    expect((await db.progress.toCollection().first())?.lessonId).toBe(keepLessonId)
    expect(await db.meta.get(DEPLOYED_CONTENT_VERSION_KEY)).toEqual({
      key: DEPLOYED_CONTENT_VERSION_KEY,
      value: '5',
    })
    expect(await db.meta.get(DEPLOYED_CONTENT_HASH_KEY)).toEqual({
      key: DEPLOYED_CONTENT_HASH_KEY,
      value: fingerprintContent(deployed),
    })
  })

  it('exports content without progress and only bumps version for changes', async () => {
    const courseId = await makeCourse()
    const lessonId = await makeLesson(courseId)
    await createQuestion(lessonId, { nativePhrase: 'I', foreignPhrase: 'jag' })
    await recordLessonResult({
      courseId,
      lessonId,
      correct: 1,
      total: 1,
    })

    const first = await createDeployedContentFile()
    expect(first.contentVersion).toBe(1)
    expect(first.courses).toHaveLength(1)
    expect(first.lessons).toHaveLength(1)
    expect(first.questions).toHaveLength(1)
    expect('progress' in first).toBe(false)
    expect('meta' in first).toBe(false)
    expect(() =>
      parseDeployedContent(JSON.parse(JSON.stringify(first))),
    ).not.toThrow()

    await markDeployedContentPublished(first)

    const unchanged = await createDeployedContentFile()
    expect(unchanged.contentVersion).toBe(1)

    const course = (await db.courses.get(courseId))!
    await updateCourse(courseId, {
      title: 'Changed title',
      description: course.description,
      language: course.language,
      instructionLanguage: course.instructionLanguage,
      version: course.version,
      inProduction: course.inProduction,
    })

    const changed = await createDeployedContentFile()
    expect(changed.contentVersion).toBe(2)
    expect(changed.courses[0]?.title).toBe('Changed title')
  })

  it('reports unpublished content changes', async () => {
    await makeCourse()

    const before = await getDeployStatus()
    expect(before.current.courses).toBe(1)
    expect(before.hasUnpublishedChanges).toBe(true)

    const published = await currentDeployedFile(1)
    await markDeployedContentPublished(published)

    const after = await getDeployStatus()
    expect(after.localVersion).toBe(1)
    expect(after.hasUnpublishedChanges).toBe(false)
  })

  it('clears publishing metadata when the database is reset', async () => {
    await db.meta.bulkPut([
      { key: DEPLOYED_CONTENT_VERSION_KEY, value: '4' },
      { key: DEPLOYED_CONTENT_HASH_KEY, value: 'abc123' },
    ])

    await resetAll()

    expect(await db.meta.get(DEPLOYED_CONTENT_VERSION_KEY)).toBeUndefined()
    expect(await db.meta.get(DEPLOYED_CONTENT_HASH_KEY)).toBeUndefined()
  })

  it('rejects invalid deploy files', () => {
    expect(() => parseDeployedContent({})).toThrow()
    expect(() =>
      parseDeployedContent({
        app: 'kuku',
        kind: 'deployed-content',
        schemaVersion: 1,
        contentVersion: 1,
        updatedAt: new Date().toISOString(),
        courses: [{ id: 'not-a-number' }],
        lessons: [],
        questions: [],
      }),
    ).toThrow()
  })

  it('does not confuse a full backup with a deploy file', async () => {
    const backup = await exportAll()
    expect(() => parseDeployedContent(backup)).toThrow()
  })
})
