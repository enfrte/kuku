import { describe, expect, it } from 'vitest'
import { slugify, uniqueSlug } from './slug'
import { parseBatchQuestions, splitPhraseLines } from './validation'

describe('slug', () => {
  it('slugifies titles and handles empty input', () => {
    expect(slugify('  100 Swedish Lessons! ')).toBe('100-swedish-lessons')
    expect(slugify('Äpplen och päron')).toBe('applen-och-paron')
    expect(slugify('???')).toBe('untitled')
  })

  it('adds a numeric suffix until the slug is unique', () => {
    expect(uniqueSlug('courses', ['courses', 'courses-2'])).toBe('courses-3')
    expect(uniqueSlug('new', ['courses'])).toBe('new')
  })
})

describe('splitPhraseLines', () => {
  it('normalises, removes blanks, and de-duplicates alternatives', () => {
    expect(splitPhraseLines('  one  \n\none\ntwo ')).toEqual(['one', 'two'])
    expect(splitPhraseLines(['a', ' a ', 'b'])).toEqual(['a', 'b'])
  })
})

describe('parseBatchQuestions', () => {
  it('parses quoted comma-separated rows', () => {
    const result = parseBatchQuestions(
      '"Hän puhuu suomea hyvin","He speaks Finnish well"\n"Jag är här","I am here"',
    )

    expect(result.errors).toEqual([])
    expect(result.rows).toEqual([
      { foreignPhrase: 'Hän puhuu suomea hyvin', nativePhrase: 'He speaks Finnish well' },
      { foreignPhrase: 'Jag är här', nativePhrase: 'I am here' },
    ])
  })

  it('supports tab-separated rows that also contain commas', () => {
    const result = parseBatchQuestions('farbrodern, morbrodern\tthe uncle')

    expect(result.errors).toEqual([])
    expect(result.rows).toEqual([
      { foreignPhrase: 'farbrodern, morbrodern', nativePhrase: 'the uncle' },
    ])
  })

  it('skips a header row and reports malformed rows', () => {
    const result = parseBatchQuestions('Foreign phrase,Native phrase\nonly one column\n')

    expect(result.rows).toEqual([])
    expect(result.errors).toEqual([
      'Line 2: expected a foreign phrase and a native phrase.',
    ])
  })
})
