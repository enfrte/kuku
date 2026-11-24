import Dexie, { type EntityTable } from 'dexie'

export type Flag = 0 | 1

export interface Course {
  id: number
  title: string
  description: string
  language: string
  instructionLanguage: string
  slug: string
  version: number
  inProduction: Flag
  createdAt: number
  updatedAt: number
}

export interface Lesson {
  id: number
  courseId: number
  title: string
  description: string
  slug: string
  tutorial: string
  level: number
  inProduction: Flag
  createdAt: number
  updatedAt: number
}

export interface Question {
  id: number
  lessonId: number
  nativePhrase: string
  foreignPhrase: string
  alternativeNativePhrases: string[]
  alternativeForeignPhrases: string[]
  createdAt: number
  updatedAt: number
}

export interface LessonProgress {
  id: number
  lessonId: number
  courseId: number
  attempts: number
  bestScore: number
  completedAt?: number
  lastPlayedAt: number
}

export interface Meta {
  key: string
  value: string
}

export const db = new Dexie('kuku') as Dexie & {
  courses: EntityTable<Course, 'id'>
  lessons: EntityTable<Lesson, 'id'>
  questions: EntityTable<Question, 'id'>
  progress: EntityTable<LessonProgress, 'id'>
  meta: EntityTable<Meta, 'key'>
}

db.version(1).stores({
  courses: '++id, inProduction',
  lessons: '++id, courseId, [courseId+inProduction]',
  questions: '++id, lessonId',
  progress: '++id, &lessonId, courseId',
  meta: 'key',
})
