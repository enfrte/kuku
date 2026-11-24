import { normalizeWord } from './quizEngine'

const AUDIO_LANGUAGES = new Set(['swe'])

export function hasAudio(language: string): boolean {
  return AUDIO_LANGUAGES.has(language)
}

export function playWordAudio(word: string, language: string): void {
  if (!hasAudio(language)) return
  const normalized = normalizeWord(word)
  if (!normalized) return

  const audio = new Audio(
    `/audio/${language}/mp3/${encodeURIComponent(normalized)}_${language}.mp3`,
  )
  void audio.play().catch(() => {
    // Missing audio is expected for new words; playback is best-effort.
  })
}
