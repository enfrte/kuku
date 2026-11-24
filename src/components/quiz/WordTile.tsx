const tileClasses = 'btn btn-sm rounded-4 border-2 m-1 py-2 px-3 word-tile'

export function WordTile({
  word,
  onClick,
  tone = 'choice',
  title,
}: {
  word: string
  onClick: () => void
  tone?: 'choice' | 'chosen'
  title?: string
}) {
  return (
    <button
      type="button"
      className={`${tileClasses} ${
        tone === 'chosen'
          ? 'btn-light border-secondary text-dark'
          : 'btn-outline-dark bg-white text-dark'
      }`}
      onClick={onClick}
      title={title}
    >
      {word}
    </button>
  )
}

export function WordTilePlaceholder({ word }: { word: string }) {
  return (
    <span className={`${tileClasses} word-tile-placeholder`} aria-hidden="true">
      {word}
    </span>
  )
}
