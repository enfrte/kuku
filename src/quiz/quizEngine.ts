import type { Question } from '../db/db'
import { clampScore } from '../db/validation'

export interface QuizTile {
  id: string
  word: string
}

export type Rng = () => number

export function normalizeWord(word: string): string {
  return word
    .replace(/[.,!?;:()"']/g, '')
    .toLowerCase()
    .trim()
}

export function splitWords(phrase: string): string[] {
  return phrase.trim().split(/\s+/).filter(Boolean)
}

export function shuffle<T>(items: readonly T[], rng: Rng = Math.random): T[] {
  const result = [...items]
  for (let index = result.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.min(index, Math.floor(rng() * (index + 1)))
    ;[result[index], result[randomIndex]] = [result[randomIndex], result[index]]
  }
  return result
}

function pickDistractor(
  question: Question,
  allQuestions: readonly Question[],
  rng: Rng,
): string | undefined {
  const currentWords = new Set(
    splitWords(question.foreignPhrase).map((word) => normalizeWord(word)),
  )
  const candidates: string[] = []
  const seen = new Set<string>()

  for (const other of allQuestions) {
    if (other.id === question.id) continue
    for (const word of splitWords(other.foreignPhrase)) {
      const normalized = normalizeWord(word)
      if (!normalized || currentWords.has(normalized) || seen.has(normalized)) continue
      seen.add(normalized)
      candidates.push(word)
    }
  }

  if (candidates.length === 0) return undefined
  const index = Math.min(
    candidates.length - 1,
    Math.floor(rng() * candidates.length),
  )
  return candidates[index]
}

export function buildTiles(
  question: Question,
  allQuestions: readonly Question[],
  rng: Rng = Math.random,
): QuizTile[] {
  const words = splitWords(question.foreignPhrase)
  const distractor = pickDistractor(question, allQuestions, rng)
  const pool = distractor ? [...words, distractor] : words

  return shuffle(
    pool.map((word, index) => ({ id: `${index}:${word}`, word })),
    rng,
  )
}

function normalizedWords(phrase: string): string[] {
  return splitWords(phrase).map((word) => normalizeWord(word))
}

export function isCorrectAnswer(
  chosenWords: readonly string[],
  question: Question,
): boolean {
  const chosen = chosenWords.map((word) => normalizeWord(word))
  const accepted = [
    question.foreignPhrase,
    ...question.alternativeForeignPhrases,
  ]

  return accepted.some((phrase) => {
    const expected = normalizedWords(phrase)
    return (
      expected.length === chosen.length &&
      expected.every((word, index) => word === chosen[index])
    )
  })
}

export function scoreAnswers(correct: number, total: number): number {
  if (total <= 0) return 0
  return clampScore((correct / total) * 100)
}
