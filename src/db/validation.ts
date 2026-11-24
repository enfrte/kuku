import { isKnownLanguage } from '../data/languages'
import { ValidationError } from './errors'

export function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, ' ').trim()
}

export function normalizePhrase(value: string): string {
  return normalizeWhitespace(value)
}

export function splitPhraseLines(value: string | string[] | undefined): string[] {
  const lines = Array.isArray(value) ? value : (value ?? '').split(/\r?\n/)
  const seen = new Set<string>()
  const phrases: string[] = []

  for (const line of lines) {
    const phrase = normalizePhrase(line)
    if (!phrase || seen.has(phrase)) continue
    seen.add(phrase)
    phrases.push(phrase)
  }

  return phrases
}

export function assertRequired(
  errors: Record<string, string>,
  field: string,
  label: string,
  value: string,
): void {
  if (!value.trim()) errors[field] = `${label} is required.`
}

export function assertMaxLength(
  errors: Record<string, string>,
  field: string,
  label: string,
  value: string,
  max: number,
): void {
  if (value.length > max) errors[field] = `${label} must be ${max} characters or fewer.`
}

export function assertLanguage(
  errors: Record<string, string>,
  field: string,
  label: string,
  code: string,
): void {
  if (!code) {
    errors[field] = `${label} is required.`
  } else if (!isKnownLanguage(code)) {
    errors[field] = `${label} must be a known ISO 639-3 language code.`
  }
}

export function assertInteger(
  errors: Record<string, string>,
  field: string,
  label: string,
  value: number,
  min: number,
): void {
  if (!Number.isInteger(value) || value < min) {
    errors[field] = `${label} must be an integer of at least ${min}.`
  }
}

export function throwIfErrors(errors: Record<string, string>): void {
  if (Object.keys(errors).length > 0) throw new ValidationError(errors)
}

export function clampScore(score: number): number {
  return Math.max(0, Math.min(100, Math.round(score)))
}

export interface ParsedBatchRow {
  foreignPhrase: string
  nativePhrase: string
}

export interface BatchParseResult {
  rows: ParsedBatchRow[]
  errors: string[]
}

function parseCsvLine(line: string): string[] {
  const delimiter = line.includes('\t') ? '\t' : ','
  const fields: string[] = []
  let current = ''
  let quoted = false

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index]

    if (quoted) {
      if (char === '"' && line[index + 1] === '"') {
        current += '"'
        index += 1
      } else if (char === '"') {
        quoted = false
      } else {
        current += char
      }
    } else if (char === '"') {
      quoted = true
    } else if (char === delimiter) {
      fields.push(current)
      current = ''
    } else {
      current += char
    }
  }

  fields.push(current)
  return fields
}

/**
 * Batch format matches the old app: "foreign phrase","native phrase".
 * Quoted CSV and tab-separated lines are both accepted.
 */
export function parseBatchQuestions(text: string): BatchParseResult {
  const rows: ParsedBatchRow[] = []
  const errors: string[] = []
  const lines = text.split(/\r?\n/)

  lines.forEach((line, index) => {
    const lineNumber = index + 1
    if (!line.trim()) return

    const fields = parseCsvLine(line)
    const foreignPhrase = normalizePhrase(fields[0] ?? '')
    const nativePhrase = normalizePhrase(fields[1] ?? '')

    if (lineNumber === 1 && /^foreign( phrase)?$/i.test(foreignPhrase)) return

    if (!foreignPhrase || !nativePhrase) {
      errors.push(`Line ${lineNumber}: expected a foreign phrase and a native phrase.`)
      return
    }
    if (foreignPhrase.length > 600 || nativePhrase.length > 600) {
      errors.push(`Line ${lineNumber}: phrases must be 600 characters or fewer.`)
      return
    }

    rows.push({ foreignPhrase, nativePhrase })
  })

  return { rows, errors }
}
