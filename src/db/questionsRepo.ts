import { type Question, db } from './db'
import { ValidationError } from './errors'
import {
  assertMaxLength,
  assertRequired,
  normalizePhrase,
  splitPhraseLines,
  throwIfErrors,
} from './validation'

export interface QuestionInput {
  nativePhrase: string
  foreignPhrase: string
  alternativeNativePhrases?: string | string[]
  alternativeForeignPhrases?: string | string[]
}

export interface BulkQuestionInput {
  foreignPhrase: string
  nativePhrase: string
}

export async function listQuestions(lessonId: number): Promise<Question[]> {
  const questions = await db.questions.where('lessonId').equals(lessonId).toArray()
  return questions.sort(
    (a, b) => a.createdAt - b.createdAt || (a.id ?? 0) - (b.id ?? 0),
  )
}

export async function getQuestion(id: number): Promise<Question | undefined> {
  return db.questions.get(id)
}

interface NormalizedQuestionInput {
  nativePhrase: string
  foreignPhrase: string
  alternativeNativePhrases: string[]
  alternativeForeignPhrases: string[]
}

function normalizeQuestionInput(input: QuestionInput): NormalizedQuestionInput {
  return {
    nativePhrase: normalizePhrase(input.nativePhrase),
    foreignPhrase: normalizePhrase(input.foreignPhrase),
    alternativeNativePhrases: splitPhraseLines(input.alternativeNativePhrases),
    alternativeForeignPhrases: splitPhraseLines(input.alternativeForeignPhrases),
  }
}

function validateQuestionInput(input: NormalizedQuestionInput): void {
  const errors: Record<string, string> = {}
  assertRequired(errors, 'nativePhrase', 'Native phrase', input.nativePhrase ?? '')
  assertRequired(errors, 'foreignPhrase', 'Foreign phrase', input.foreignPhrase ?? '')
  assertMaxLength(
    errors,
    'nativePhrase',
    'Native phrase',
    input.nativePhrase ?? '',
    600,
  )
  assertMaxLength(
    errors,
    'foreignPhrase',
    'Foreign phrase',
    input.foreignPhrase ?? '',
    600,
  )

  for (const phrase of input.alternativeNativePhrases ?? []) {
    if (phrase.length > 600) {
      errors.alternativeNativePhrases =
        'Alternative native phrases must be 600 characters or fewer each.'
    }
  }
  for (const phrase of input.alternativeForeignPhrases ?? []) {
    if (phrase.length > 600) {
      errors.alternativeForeignPhrases =
        'Alternative foreign phrases must be 600 characters or fewer each.'
    }
  }

  throwIfErrors(errors)
}

export async function createQuestion(
  lessonId: number,
  input: QuestionInput,
): Promise<number> {
  const normalized = normalizeQuestionInput(input)
  validateQuestionInput(normalized)

  return db.transaction('rw', [db.lessons, db.questions], async () => {
    const lesson = await db.lessons.get(lessonId)
    if (!lesson) throw new ValidationError({ form: 'Lesson not found.' })

    const now = Date.now()
    return db.questions.add({
      lessonId,
      nativePhrase: normalized.nativePhrase,
      foreignPhrase: normalized.foreignPhrase,
      alternativeNativePhrases: normalized.alternativeNativePhrases ?? [],
      alternativeForeignPhrases: normalized.alternativeForeignPhrases ?? [],
      createdAt: now,
      updatedAt: now,
    })
  })
}

export async function updateQuestion(
  id: number,
  input: QuestionInput,
): Promise<void> {
  const normalized = normalizeQuestionInput(input)
  validateQuestionInput(normalized)

  await db.transaction('rw', db.questions, async () => {
    const existing = await db.questions.get(id)
    if (!existing) throw new ValidationError({ form: 'Question not found.' })

    await db.questions.update(id, {
      nativePhrase: normalized.nativePhrase,
      foreignPhrase: normalized.foreignPhrase,
      alternativeNativePhrases: normalized.alternativeNativePhrases ?? [],
      alternativeForeignPhrases: normalized.alternativeForeignPhrases ?? [],
      updatedAt: Date.now(),
    })
  })
}

export async function deleteQuestion(id: number): Promise<void> {
  await db.questions.delete(id)
}

export async function bulkCreateQuestions(
  lessonId: number,
  rows: BulkQuestionInput[],
): Promise<number> {
  if (rows.length === 0) return 0

  const normalizedRows = rows.map((row) =>
    normalizeQuestionInput({
      foreignPhrase: row.foreignPhrase,
      nativePhrase: row.nativePhrase,
    }),
  )
  normalizedRows.forEach(validateQuestionInput)

  return db.transaction('rw', [db.lessons, db.questions], async () => {
    const lesson = await db.lessons.get(lessonId)
    if (!lesson) throw new ValidationError({ form: 'Lesson not found.' })

    const now = Date.now()
    const records = normalizedRows.map((row, index) => ({
      lessonId,
      nativePhrase: row.nativePhrase,
      foreignPhrase: row.foreignPhrase,
      alternativeNativePhrases: [],
      alternativeForeignPhrases: [],
      createdAt: now + index,
      updatedAt: now + index,
    }))

    await db.questions.bulkAdd(records)
    return records.length
  })
}
