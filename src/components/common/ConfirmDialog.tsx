import { useEffect, useState } from 'react'

export function ConfirmDialog({
  open,
  title,
  body,
  confirmLabel = 'Delete',
  variant = 'danger',
  busy = false,
  onConfirm,
  onCancel,
}: {
  open: boolean
  title: string
  body: string
  confirmLabel?: string
  variant?: 'danger' | 'primary' | 'warning'
  busy?: boolean
  onConfirm: () => void
  onCancel: () => void
}) {
  useEffect(() => {
    if (!open) return
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !busy) onCancel()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, busy, onCancel])

  if (!open) return null

  return (
    <>
      <div className="modal d-block" tabIndex={-1} role="dialog" aria-modal="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title h5">{title}</h2>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                disabled={busy}
                onClick={onCancel}
              />
            </div>
            <div className="modal-body">
              <p className="mb-0">{body}</p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-outline-secondary"
                disabled={busy}
                onClick={onCancel}
              >
                Cancel
              </button>
              <button
                type="button"
                className={`btn btn-${variant}`}
                disabled={busy}
                onClick={onConfirm}
              >
                {busy ? (
                  <span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />
                ) : null}
                {confirmLabel}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop show" />
    </>
  )
}

export function useConfirm() {
  const [open, setOpen] = useState(false)
  return { open, show: () => setOpen(true), hide: () => setOpen(false) }
}
