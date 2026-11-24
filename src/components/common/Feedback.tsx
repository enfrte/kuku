import { type ReactNode } from 'react'

export function Loading({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="d-flex align-items-center gap-2 text-secondary py-5">
      <span className="spinner-border spinner-border-sm" aria-hidden="true" />
      <span>{label}</span>
    </div>
  )
}

export function EmptyState({
  title,
  children,
}: {
  title: string
  children?: ReactNode
}) {
  return (
    <div className="text-center border rounded-4 bg-white p-5 my-4">
      <h2 className="h4">{title}</h2>
      {children ? <div className="text-secondary">{children}</div> : null}
    </div>
  )
}
