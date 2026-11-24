import { useState, type ChangeEvent } from 'react'
import { ConfirmDialog } from '../../components/common/ConfirmDialog'
import { ErrorAlert } from '../../components/common/ErrorAlert'
import { Loading } from '../../components/common/Feedback'
import { useBackup } from '../../hooks/useBackup'
import { useStats } from '../../hooks/useStats'

interface PendingAction {
  title: string
  body: string
  confirmLabel: string
  variant: 'danger' | 'primary' | 'warning'
  run: () => Promise<void>
}

export function DataPage() {
  const { stats, isLoading } = useStats()
  const backup = useBackup()
  const [error, setError] = useState<unknown>(null)
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const [pending, setPending] = useState<PendingAction | null>(null)

  async function handleExport() {
    setError(null)
    setMessage('')
    try {
      const data = await backup.exportAll()
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json',
      })
      const url = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = `kuku-backup-${new Date().toISOString().slice(0, 10)}.json`
      anchor.click()
      URL.revokeObjectURL(url)
      setMessage('Backup downloaded.')
    } catch (caught) {
      setError(caught)
    }
  }

  async function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    setError(null)
    setMessage('')

    try {
      const text = await file.text()
      const parsed: unknown = JSON.parse(text)
      setPending({
        title: 'Replace all local data?',
        body: `Import “${file.name}” and replace every course, lesson, question, and progress entry in this browser? This cannot be undone.`,
        confirmLabel: 'Import and replace',
        variant: 'danger',
        run: async () => {
          await backup.importAll(parsed)
          setMessage('Backup imported successfully.')
        },
      })
    } catch (caught) {
      setError(caught)
    }
  }

  async function runPending() {
    if (!pending) return
    setBusy(true)
    setError(null)
    setMessage('')
    try {
      await pending.run()
      setPending(null)
    } catch (caught) {
      setError(caught)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      <div className="row g-3 mb-4">
        {isLoading || !stats ? (
          <div className="col-12">
            <Loading label="Loading database stats…" />
          </div>
        ) : (
          [
            ['Courses', stats.courses],
            ['Lessons', stats.lessons],
            ['Questions', stats.questions],
            ['Completed lessons', stats.completedLessons],
          ].map(([label, value]) => (
            <div className="col-6 col-md-3" key={label}>
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <div className="text-secondary small">{label}</div>
                  <div className="h3 mb-0">{value}</div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="alert alert-info" role="note">
        <strong>Local-only storage.</strong> All content lives in this browser’s
        IndexedDB. Clearing site data, using a different browser, or switching devices
        means starting from a different database. Export a backup regularly.
      </div>

      <ErrorAlert error={error} />
      {message ? (
        <div className="alert alert-success" role="status">
          {message}
        </div>
      ) : null}

      <div className="row g-4">
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-4">
              <h2 className="h5">Backup</h2>
              <p className="text-secondary">
                Download all courses, lessons, questions, progress, and metadata as a
                single JSON file.
              </p>
              <button type="button" className="btn btn-kuku" onClick={handleExport}>
                <i className="bi bi-download me-1" aria-hidden="true" />
                Export JSON
              </button>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-4">
              <h2 className="h5">Restore</h2>
              <p className="text-secondary">
                Import a kuku backup. This replaces everything currently stored in this
                browser.
              </p>
              <label className="btn btn-outline-dark mb-0">
                <i className="bi bi-upload me-1" aria-hidden="true" />
                Choose backup file
                <input
                  type="file"
                  accept="application/json,.json"
                  className="visually-hidden"
                  onChange={handleFile}
                />
              </label>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-4">
              <h2 className="h5">Demo course</h2>
              <p className="text-secondary">
                Add another copy of the bundled Swedish demo course. Existing content is
                left untouched and all IDs are remapped.
              </p>
              <button
                type="button"
                className="btn btn-outline-dark"
                onClick={() =>
                  setPending({
                    title: 'Load demo course?',
                    body: 'Add another copy of “100 Swedish Lessons” to this browser?',
                    confirmLabel: 'Load demo',
                    variant: 'primary',
                    run: async () => {
                      await backup.loadDemoCourse()
                      setMessage('Demo course loaded.')
                    },
                  })
                }
              >
                <i className="bi bi-magic me-1" aria-hidden="true" />
                Load demo course
              </button>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card border-danger shadow-sm h-100">
            <div className="card-body p-4">
              <h2 className="h5 text-danger">Danger zone</h2>
              <p className="text-secondary">
                Remove all courses, lessons, questions, and progress from this browser.
                Export first if you want to keep anything.
              </p>
              <button
                type="button"
                className="btn btn-outline-danger"
                onClick={() =>
                  setPending({
                    title: 'Reset local database?',
                    body: 'Delete every course, lesson, question, and progress entry in this browser? This cannot be undone.',
                    confirmLabel: 'Delete everything',
                    variant: 'danger',
                    run: async () => {
                      await backup.resetAll()
                      setMessage('Local database reset.')
                    },
                  })
                }
              >
                <i className="bi bi-trash me-1" aria-hidden="true" />
                Reset database
              </button>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={pending !== null}
        title={pending?.title ?? ''}
        body={pending?.body ?? ''}
        confirmLabel={pending?.confirmLabel}
        variant={pending?.variant}
        busy={busy}
        onCancel={() => setPending(null)}
        onConfirm={runPending}
      />
    </div>
  )
}
