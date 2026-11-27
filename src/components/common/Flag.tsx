import { languageLabel } from '../../data/languages'

const FLAGS: Record<string, string> = {
  fin: '/flags/flag_fin.svg',
  ile: '/flags/flag_ile.svg',
  lfn: '/flags/flag_lfn.svg',
  swe: '/flags/flag_swe.svg',
}

export function Flag({
  code,
  size = 64,
}: {
  code: string
  size?: number
}) {
  const src = FLAGS[code]

  if (src) {
    return (
      <img
        src={src}
        alt={`${languageLabel(code)} flag`}
        width={size}
        height={Math.round(size * 0.8)}
        style={{ objectFit: 'contain' }}
      />
    )
  }

  return (
    <span
      className="d-inline-flex align-items-center justify-content-center rounded-3 bg-light border text-secondary"
      style={{ width: size, height: Math.round(size * 0.8), fontSize: size * 0.25 }}
      aria-label={languageLabel(code)}
      title={languageLabel(code)}
    >
      <i className="bi bi-globe2 me-1" aria-hidden="true" />
      {code.toUpperCase()}
    </span>
  )
}
