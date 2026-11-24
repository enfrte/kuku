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
      className={`btn btn-sm rounded-4 border-2 m-1 py-2 px-3 word-tile ${
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
