import deployedJson from './seed/deployedContent.json'
import { type Course, type Flag, type Lesson, type Question, db } from './db'
import { ValidationError } from './errors'
import { ensureSeeded } from './seedRepo'

export const DEPLOYED_CONTENT_SCHEMA_VERSION = 1
export const DEPLOYED_CONTENT_VERSION_KEY = 'deployedContentVersion'
export const DEPLOYED_CONTENT_HASH_KEY = 'deployedContentHash'
export const CONTENT_UPDATE_DISMISSED_KEY = 'dismissedContentVersion'

export interface ContentSnapshot {
  courses: Course[]
  lessons: Lesson[]
  questions: Question[]
}

export interface DeployedContentFile extends ContentSnapshot {
  app: 'kuku'
  kind: 'deployed-content'
  schemaVersion: number
  contentVersion: number
  updatedAt: string
  contentHash?: string
}

export interface ContentInitResult {
  imported: boolean
  seeded: boolean
  pendingUpdate: DeployedContentFile | null
  localVersion: number
}

export interface ContentCounts {
  courses: number
  lessons: number
  questions: number
}

export interface DeployStatus {
  deployedVersion: number
  localVersion: number
  hasUnpublishedChanges: boolean
  hasNewerDeployedContent: boolean
  current: ContentCounts
  deployed: ContentCounts
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isString(value: unknown): value is string {
  return typeof value === 'string'
}

function isNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

function isInteger(value: unknown): value is number {
  return isNumber(value) && Number.isInteger(value)
}

function isFlag(value: unknown): value is Flag {
  return value === 0 || value === 1
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(isString)
}

function invalid(file: string): never {
  throw new ValidationError({ file })
}

export function parseDeployedContent(value: unknown): DeployedContentFile {
  if (!isRecord(value) || value.app !== 'kuku') {
    invalid('This is not a kuku deploy file.')
  }
  if (value.kind !== 'deployed-content') {
    invalid('This file is not a deployable content file.')
  }
  if (value.schemaVersion !== DEPLOYED_CONTENT_SCHEMA_VERSION) {
    invalid(
      `Unsupported deploy file schema version. Expected ${DEPLOYED_CONTENT_SCHEMA_VERSION}.`,
    )
  }
  if (!isInteger(value.contentVersion) || value.contentVersion < 0) {
    invalid('The deploy file has an invalid content version.')
  }
  if (!isString(value.updatedAt)) {
    invalid('The deploy file has no updatedAt timestamp.')
  }
  if (value.contentHash !== undefined && !isString(value.contentHash)) {
    invalid('The deploy file has an invalid content hash.')
  }

  const { courses, lessons, questions } = value
  if (!Array.isArray(courses) || !Array.isArray(lessons) || !Array.isArray(questions)) {
    invalid('The deploy file is missing one or more content tables.')
  }

  courses.forEach((course, index) => {
    if (
      !isRecord(course) ||
      !isInteger(course.id) ||
      !isString(course.title) ||
      !isString(course.description) ||
      !isString(course.language) ||
      !isString(course.instructionLanguage) ||
      !isString(course.slug) ||
      !isInteger(course.version) ||
      !isFlag(course.inProduction) ||
      !isNumber(course.createdAt) ||
      !isNumber(course.updatedAt)
    ) {
      invalid(`Invalid course at index ${index}.`)
    }
  })

  lessons.forEach((lesson, index) => {
    if (
      !isRecord(lesson) ||
      !isInteger(lesson.id) ||
      !isInteger(lesson.courseId) ||
      !isString(lesson.title) ||
      !isString(lesson.description) ||
      !isString(lesson.slug) ||
      !isString(lesson.tutorial) ||
      !isInteger(lesson.level) ||
      !isFlag(lesson.inProduction) ||
      !isNumber(lesson.createdAt) ||
      !isNumber(lesson.updatedAt)
    ) {
      invalid(`Invalid lesson at index ${index}.`)
    }
  })

  questions.forEach((question, index) => {
    if (
      !isRecord(question) ||
      !isInteger(question.id) ||
      !isInteger(question.lessonId) ||
      !isString(question.nativePhrase) ||
      !isString(question.foreignPhrase) ||
      !isStringArray(question.alternativeNativePhrases) ||
      !isStringArray(question.alternativeForeignPhrases) ||
      !isNumber(question.createdAt) ||
      !isNumber(question.updatedAt)
    ) {
      invalid(`Invalid question at index ${index}.`)
    }
  })

  return value as unknown as DeployedContentFile
}

let cachedDeployedContent: DeployedContentFile | undefined

export function readDeployedContent(): DeployedContentFile {
  if (cachedDeployedContent) return cachedDeployedContent

  try {
    cachedDeployedContent = parseDeployedContent(deployedJson)
  } catch (error) {
    console.warn(
      'The bundled deployed content file could not be read. Falling back to local data.',
      error,
    )
    cachedDeployedContent = {
      app: 'kuku',
      kind: 'deployed-content',
      schemaVersion: DEPLOYED_CONTENT_SCHEMA_VERSION,
      contentVersion: 0,
      updatedAt: '',
      courses: [],
      lessons: [],
      questions: [],
    }
  }

  return cachedDeployedContent
}

const byId = <T extends { id: number }>(a: T, b: T): number => a.id - b.id

function stableValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(stableValue)
  if (isRecord(value)) {
    const sorted: Record<string, unknown> = {}
    for (const key of Object.keys(value).sort()) {
      sorted[key] = stableValue(value[key])
    }
    return sorted
  }
  return value
}

export function fingerprintContent(content: ContentSnapshot): string {
  const canonical = {
    courses: [...content.courses].sort(byId),
    lessons: [...content.lessons].sort(byId),
    questions: [...content.questions].sort(byId),
  }
  const text = JSON.stringify(stableValue(canonical))

  let hash = 0x811c9dc5
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index)
    hash = Math.imul(hash, 0x01000193)
  }
  return (hash >>> 0).toString(16).padStart(8, '0')
}

export async function getCurrentContent(): Promise<ContentSnapshot> {
  const [courses, lessons, questions] = await Promise.all([
    db.courses.toArray(),
    db.lessons.toArray(),
    db.questions.toArray(),
  ])

  return { courses, lessons, questions }
}

async function readMetaNumber(key: string): Promise<number> {
  const entry = await db.meta.get(key)
  if (!entry) return 0
  const value = Number(entry.value)
  return Number.isFinite(value) && value >= 0 ? value : 0
}

async function readMetaString(key: string): Promise<string | undefined> {
  const entry = await db.meta.get(key)
  return entry?.value
}

async function putMetaNumber(key: string, value: number): Promise<void> {
  await db.meta.put({ key, value: String(value) })
}

function countsOf(content: ContentSnapshot): ContentCounts {
  return {
    courses: content.courses.length,
    lessons: content.lessons.length,
    questions: content.questions.length,
  }
}

/**
 * Creates a deployable content file from the current database. Progress, meta, and
 * other browser-only data are deliberately excluded.
 */
export async function createDeployedContentFile(): Promise<DeployedContentFile> {
  const content = await getCurrentContent()
  const hash = fingerprintContent(content)
  const deployed = readDeployedContent()
  const localVersion = await readMetaNumber(DEPLOYED_CONTENT_VERSION_KEY)
  const lastHash = await readMetaString(DEPLOYED_CONTENT_HASH_KEY)
  const baseVersion = Math.max(localVersion, deployed.contentVersion)
  const contentVersion = lastHash === hash ? baseVersion : baseVersion + 1

  return {
    app: 'kuku',
    kind: 'deployed-content',
    schemaVersion: DEPLOYED_CONTENT_SCHEMA_VERSION,
    contentVersion,
    updatedAt: new Date().toISOString(),
    contentHash: hash,
    ...content,
  }
}

/**
 * Records that the current content was downloaded as a deploy file. Call this only
 * after the download succeeds.
 */
export async function markDeployedContentPublished(
  file: DeployedContentFile,
): Promise<void> {
  const hash = fingerprintContent(file)
  await db.meta.bulkPut([
    { key: DEPLOYED_CONTENT_VERSION_KEY, value: String(file.contentVersion) },
    { key: DEPLOYED_CONTENT_HASH_KEY, value: hash },
  ])
  await db.meta.delete(CONTENT_UPDATE_DISMISSED_KEY)
}

/**
 * Replaces local course content with a deployed file. Lesson progress is kept only
 * when the lesson and course IDs still match.
 */
export async function applyDeployedContent(value: unknown): Promise<void> {
  const deployed = parseDeployedContent(value)
  const hash = fingerprintContent(deployed)

  await db.transaction(
    'rw',
    [db.courses, db.lessons, db.questions, db.progress, db.meta],
    async () => {
      const lessonCourses = new Map(
        deployed.lessons.map((lesson) => [lesson.id, lesson.courseId]),
      )
      const progress = await db.progress.toArray()
      const keptProgress = progress.filter(
        (entry) => lessonCourses.get(entry.lessonId) === entry.courseId,
      )

      await Promise.all([
        db.courses.clear(),
        db.lessons.clear(),
        db.questions.clear(),
        db.progress.clear(),
      ])

      if (deployed.courses.length > 0) await db.courses.bulkAdd(deployed.courses)
      if (deployed.lessons.length > 0) await db.lessons.bulkAdd(deployed.lessons)
      if (deployed.questions.length > 0) await db.questions.bulkAdd(deployed.questions)
      if (keptProgress.length > 0) await db.progress.bulkAdd(keptProgress)

      await db.meta.bulkPut([
        { key: DEPLOYED_CONTENT_VERSION_KEY, value: String(deployed.contentVersion) },
        { key: DEPLOYED_CONTENT_HASH_KEY, value: hash },
      ])
      await db.meta.delete(CONTENT_UPDATE_DISMISSED_KEY)
    },
  )
}

export async function dismissContentUpdate(version: number): Promise<void> {
  if (version <= 0) return
  await putMetaNumber(CONTENT_UPDATE_DISMISSED_KEY, version)
}

export async function getDeployStatus(): Promise<DeployStatus> {
  const [current, deployed, localVersion, lastHash] = await Promise.all([
    getCurrentContent(),
    Promise.resolve(readDeployedContent()),
    readMetaNumber(DEPLOYED_CONTENT_VERSION_KEY),
    readMetaString(DEPLOYED_CONTENT_HASH_KEY),
  ])

  const currentCounts = countsOf(current)
  const hash = fingerprintContent(current)

  return {
    deployedVersion: deployed.contentVersion,
    localVersion,
    hasUnpublishedChanges:
      currentCounts.courses > 0 && hash !== lastHash,
    hasNewerDeployedContent:
      deployed.contentVersion > localVersion && deployed.courses.length > 0,
    current: currentCounts,
    deployed: countsOf(deployed),
  }
}

/**
 * Runs before the app renders. Imports deployed content into an empty database,
 * seeds the demo when there is nothing to import, or reports a newer deployment.
 */
export async function initializeContent(
  deployed: DeployedContentFile = readDeployedContent(),
): Promise<ContentInitResult> {
  const localCourseCount = await db.courses.count()

  if (localCourseCount === 0) {
    if (deployed.courses.length > 0) {
      await applyDeployedContent(deployed)
      return {
        imported: true,
        seeded: false,
        pendingUpdate: null,
        localVersion: deployed.contentVersion,
      }
    }

    await ensureSeeded()
    await db.meta.bulkPut([
      {
        key: DEPLOYED_CONTENT_VERSION_KEY,
        value: String(deployed.contentVersion),
      },
    ])
    await db.meta.delete(DEPLOYED_CONTENT_HASH_KEY)
    await db.meta.delete(CONTENT_UPDATE_DISMISSED_KEY)
    return {
      imported: false,
      seeded: true,
      pendingUpdate: null,
      localVersion: deployed.contentVersion,
    }
  }

  const localVersion = await readMetaNumber(DEPLOYED_CONTENT_VERSION_KEY)
  const dismissedVersion = await readMetaNumber(CONTENT_UPDATE_DISMISSED_KEY)
  const pendingUpdate =
    deployed.contentVersion > localVersion &&
    deployed.contentVersion > dismissedVersion &&
    deployed.courses.length > 0
      ? deployed
      : null

  return {
    imported: false,
    seeded: false,
    pendingUpdate,
    localVersion,
  }
}
