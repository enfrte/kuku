import { useState, type ChangeEvent } from 'react'
import { ConfirmDialog } from '../../components/common/ConfirmDialog'
import { ErrorAlert } from '../../components/common/ErrorAlert'
import { Loading } from '../../components/common/Feedback'
import {
  applyDeployedContent,
  readDeployedContent,
} from '../../db/deployedContentRepo'
import { useBackup } from '../../hooks/useBackup'
import { useDeployContent } from '../../hooks/useDeployContent'
import { useStats } from '../../hooks/useStats'
import { downloadJson } from '../../utils/downloadJson'

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
  const deploy = useDeployContent()
  const [error, setError] = useState<unknown>(null)
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [pending, setPending] = useState<PendingAction | null>(null)

  async function handleExport() {
    setError(null)
    setMessage('')
    try {
      const data = await backup.exportAll()
      downloadJson(
        `kuku-backup-${new Date().toISOString().slice(0, 10)}.json`,
        data,
      )
      setMessage('Backup downloaded.')
    } catch (caught) {
      setError(caught)
    }
  }

  async function handleDownloadDeployFile() {
    setError(null)
    setMessage('')
    setPublishing(true)
    try {
      const file = await deploy.downloadDeployFile()
      setMessage(
        `Deploy file downloaded (version ${file.contentVersion}). Save it as src/db/seed/deployedContent.json, then commit and deploy.`,
      )
    } catch (caught) {
      setError(caught)
    } finally {
      setPublishing(false)
    }
  }

  function offerDeployedUpdate() {
    const deployed = readDeployedContent()
    setPending({
      title: 'Update local content?',
      body: `Replace all courses, lessons, and questions in this browser with deployed version ${deployed.contentVersion}? Lesson progress is kept where the lesson still exists. Export a backup first if you want to restore the current content.`,
      confirmLabel: 'Update content',
      variant: 'warning',
      run: async () => {
        await applyDeployedContent(deployed)
        setMessage(
          `Local content updated to deployed version ${deployed.contentVersion}.`,
        )
      },
    })
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
        <strong>Author and publish from here.</strong> Course edits are saved to this browser’s IndexedDB immediately. Download the deploy file after editing, save it as <code>src/db/seed/deployedContent.json</code>, then commit and deploy. Backups
        include progress; deploy files include only course content.
      </div>

      <ErrorAlert error={error} />
      {message ? (
        <div className="alert alert-success" role="status">
          {message}
        </div>
      ) : null}

      <div className="row g-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-4">
              <div className="d-flex flex-wrap align-items-start justify-content-between gap-2">
                <div>
                  <h2 className="h5">Publish content</h2>
                  <p className="text-secondary mb-0">
                    Download a deployable copy of every course, lesson, and question.
                  </p>
                </div>
                <span className="badge text-bg-light border">deployedContent.json</span>
              </div>

              {deploy.isLoading || !deploy.status ? (
                <Loading label="Checking published content…" />
              ) : (
                <>
                  <div className="d-flex flex-wrap gap-2 my-3">
                    <span className="badge text-bg-light border">
                      This build: v{deploy.status.deployedVersion}
                    </span>
                    <span className="badge text-bg-light border">
                      Local: v{deploy.status.localVersion}
                    </span>
                    <span
                      className={`badge ${
                        deploy.status.hasUnpublishedChanges
                          ? 'text-bg-warning'
                          : 'text-bg-success'
                      }`}
                    >
                      {deploy.status.hasUnpublishedChanges
                        ? 'Unpublished local changes'
                        : 'No unpublished changes'}
                    </span>
                  </div>
                  <p className="text-secondary small mb-3">
                    Current local content: {deploy.status.current.courses} courses,{' '}
                    {deploy.status.current.lessons} lessons,{' '}
                    {deploy.status.current.questions} questions. Deployed build:{' '}
                    {deploy.status.deployed.courses} courses,{' '}
                    {deploy.status.deployed.lessons} lessons,{' '}
                    {deploy.status.deployed.questions} questions.
                  </p>

                  {deploy.status.hasNewerDeployedContent ? (
                    <div className="alert alert-warning d-flex flex-wrap align-items-center justify-content-between gap-2">
                      <span>
                        A newer deployed content version is available (v
                        {deploy.status.deployedVersion}).
                      </span>
                      <button
                        type="button"
                        className="btn btn-sm btn-dark"
                        onClick={offerDeployedUpdate}
                      >
                        Update local content
                      </button>
                    </div>
                  ) : null}

                  <div className="d-flex flex-wrap align-items-center gap-2">
                    <button
                      type="button"
                      className="btn btn-kuku"
                      disabled={publishing || deploy.status.current.courses === 0}
                      onClick={handleDownloadDeployFile}
                    >
                      {publishing ? (
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          aria-hidden="true"
                        />
                      ) : (
                        <i className="bi bi-download me-1" aria-hidden="true" />
                      )}
                      Download deploy file
                    </button>
                    <span className="small text-secondary">
                      Save it as <code>src/db/seed/deployedContent.json</code>, then
                      commit and deploy.
                    </span>
                  </div>
                  {deploy.status.current.courses === 0 ? (
                    <div className="form-text">
                      Add a course before publishing content.
                    </div>
                  ) : null}
                </>
              )}
            </div>
          </div>
        </div>

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
