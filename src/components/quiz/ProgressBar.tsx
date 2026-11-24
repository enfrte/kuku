export function ProgressBar({
  percent,
  label,
}: {
  percent: number
  label?: string
}) {
  return (
    <div
      className="progress"
      style={{ height: 12 }}
      role="progressbar"
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label ?? 'Lesson progress'}
    >
      <div className="progress-bar bg-kuku" style={{ width: `${percent}%` }} />
    </div>
  )
}
