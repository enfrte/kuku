import {
  type Course,
  type Lesson,
  type LessonProgress,
  type Meta,
  type Question,
  db,
} from './db'
import { ValidationError } from './errors'
import { SEED_MARKER_KEY, SEED_VERSION } from './seedRepo'

export const BACKUP_SCHEMA_VERSION = 1

export interface BackupData {
  courses: Course[]
  lessons: Lesson[]
  questions: Question[]
  progress: LessonProgress[]
  meta: Meta[]
}

export interface BackupFile {
  app: 'kuku'
  schemaVersion: number
  exportedAt: string
  data: BackupData
}

export async function exportAll(): Promise<BackupFile> {
  return {
    app: 'kuku',
    schemaVersion: BACKUP_SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    data: {
      courses: await db.courses.toArray(),
      lessons: await db.lessons.toArray(),
      questions: await db.questions.toArray(),
      progress: await db.progress.toArray(),
      meta: await db.meta.toArray(),
    },
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

function isString(value: unknown): value is string {
  return typeof value === 'string'
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(isString)
}

function validateBackup(value: unknown): BackupFile {
  if (!isRecord(value) || value.app !== 'kuku') {
    throw new ValidationError({ file: 'This is not a kuku backup file.' })
  }
  if (value.schemaVersion !== BACKUP_SCHEMA_VERSION) {
    throw new ValidationError({
      file: `Unsupported backup schema version. Expected ${BACKUP_SCHEMA_VERSION}.`,
    })
  }
  if (!isRecord(value.data)) {
    throw new ValidationError({ file: 'The backup file has no data section.' })
  }

  const { courses, lessons, questions, progress, meta } = value.data
  if (
    !Array.isArray(courses) ||
    !Array.isArray(lessons) ||
    !Array.isArray(questions) ||
    !Array.isArray(progress) ||
    !Array.isArray(meta)
  ) {
    throw new ValidationError({ file: 'One or more backup tables are missing.' })
  }

  courses.forEach((course, index) => {
    if (
      !isRecord(course) ||
      !isNumber(course.id) ||
      !isString(course.title) ||
      !isString(course.language) ||
      !isString(course.instructionLanguage)
    ) {
      throw new ValidationError({ file: `Invalid course at index ${index}.` })
    }
  })

  lessons.forEach((lesson, index) => {
    if (
      !isRecord(lesson) ||
      !isNumber(lesson.id) ||
      !isNumber(lesson.courseId) ||
      !isString(lesson.title)
    ) {
      throw new ValidationError({ file: `Invalid lesson at index ${index}.` })
    }
  })

  questions.forEach((question, index) => {
    if (
      !isRecord(question) ||
      !isNumber(question.id) ||
      !isNumber(question.lessonId) ||
      !isString(question.nativePhrase) ||
      !isString(question.foreignPhrase) ||
      !isStringArray(question.alternativeNativePhrases) ||
      !isStringArray(question.alternativeForeignPhrases)
    ) {
      throw new ValidationError({ file: `Invalid question at index ${index}.` })
    }
  })

  progress.forEach((entry, index) => {
    if (
      !isRecord(entry) ||
      !isNumber(entry.id) ||
      !isNumber(entry.lessonId) ||
      !isNumber(entry.courseId)
    ) {
      throw new ValidationError({ file: `Invalid progress entry at index ${index}.` })
    }
  })

  meta.forEach((entry, index) => {
    if (!isRecord(entry) || !isString(entry.key) || !isString(entry.value)) {
      throw new ValidationError({ file: `Invalid meta entry at index ${index}.` })
    }
  })

  return value as unknown as BackupFile
}

export async function importAll(value: unknown): Promise<void> {
  const backup = validateBackup(value)

  await db.transaction(
    'rw',
    [db.courses, db.lessons, db.questions, db.progress, db.meta],
    async () => {
      await Promise.all([
        db.courses.clear(),
        db.lessons.clear(),
        db.questions.clear(),
        db.progress.clear(),
        db.meta.clear(),
      ])

      await db.courses.bulkAdd(backup.data.courses)
      await db.lessons.bulkAdd(backup.data.lessons)
      await db.questions.bulkAdd(backup.data.questions)
      await db.progress.bulkAdd(backup.data.progress)
      await db.meta.bulkAdd(backup.data.meta)

      const marker = await db.meta.get(SEED_MARKER_KEY)
      if (!marker) {
        await db.meta.put({ key: SEED_MARKER_KEY, value: SEED_VERSION })
      }
    },
  )
}

export async function resetAll(): Promise<void> {
  await db.transaction(
    'rw',
    [db.courses, db.lessons, db.questions, db.progress],
    async () => {
      await Promise.all([
        db.courses.clear(),
        db.lessons.clear(),
        db.questions.clear(),
        db.progress.clear(),
      ])
    },
  )
}
