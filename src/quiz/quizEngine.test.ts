import { describe, expect, it } from 'vitest'
import type { Question } from '../db/db'
import {
  buildTiles,
  isCorrectAnswer,
  normalizeWord,
  scoreAnswers,
  shuffle,
  splitWords,
} from './quizEngine'

function question(overrides: Partial<Question> = {}): Question {
  return {
    id: 1,
    lessonId: 1,
    nativePhrase: 'I',
    foreignPhrase: 'jag',
    alternativeNativePhrases: [],
    alternativeForeignPhrases: [],
    createdAt: 0,
    updatedAt: 0,
    ...overrides,
  }
}

describe('quizEngine', () => {
  it('normalizes punctuation and case', () => {
    expect(normalizeWord('  Hej, världen!  ')).toBe('hej världen')
    expect(normalizeWord('(parentes)')).toBe('parentes')
    expect(normalizeWord('"citat"')).toBe('citat')
  })

  it('splits phrases on whitespace', () => {
    expect(splitWords('  jag   är  här ')).toEqual(['jag', 'är', 'här'])
    expect(splitWords('   ')).toEqual([])
  })

  it('shuffles deterministically with a fixed rng', () => {
    const rng = () => 0
    expect(shuffle([1, 2, 3, 4], rng)).toEqual([2, 3, 4, 1])
  })

  it('builds tiles for every word plus one distractor', () => {
    const current = question({ id: 1, foreignPhrase: 'jag är' })
    const other = question({ id: 2, foreignPhrase: 'du är' })

    const tiles = buildTiles(current, [current, other], () => 0.5)
    const words = tiles.map((tile) => tile.word).sort()

    expect(tiles).toHaveLength(3)
    expect(words).toEqual(['du', 'jag', 'är'])
    expect(new Set(tiles.map((tile) => tile.id)).size).toBe(3)
  })

  it('does not add a distractor when the current phrase is the only content', () => {
    const current = question({ id: 1, foreignPhrase: 'jag är' })
    expect(buildTiles(current, [current])).toHaveLength(2)
  })

  it('accepts the exact foreign phrase regardless of case and punctuation', () => {
    const current = question({ foreignPhrase: 'Jag är här.' })
    expect(isCorrectAnswer(['jag', 'är', 'här'], current)).toBe(true)
    expect(isCorrectAnswer(['JAG', 'ÄR', 'HÄR'], current)).toBe(true)
  })

  it('rejects answers with the wrong order or extra words', () => {
    const current = question({ foreignPhrase: 'jag är här' })
    expect(isCorrectAnswer(['är', 'jag', 'här'], current)).toBe(false)
    expect(isCorrectAnswer(['jag', 'är'], current)).toBe(false)
    expect(isCorrectAnswer(['jag', 'är', 'här', 'nu'], current)).toBe(false)
  })

  it('accepts alternative foreign phrases', () => {
    const current = question({
      foreignPhrase: 'farbrodern, morbrodern',
      alternativeForeignPhrases: ['morbrodern, farbrodern'],
    })

    expect(isCorrectAnswer(['farbrodern', 'morbrodern'], current)).toBe(true)
    expect(isCorrectAnswer(['morbrodern', 'farbrodern'], current)).toBe(true)
  })

  it('scores answers as a rounded percentage', () => {
    expect(scoreAnswers(0, 0)).toBe(0)
    expect(scoreAnswers(1, 3)).toBe(33)
    expect(scoreAnswers(2, 3)).toBe(67)
    expect(scoreAnswers(3, 3)).toBe(100)
    expect(scoreAnswers(5, 4)).toBe(100)
  })
})
