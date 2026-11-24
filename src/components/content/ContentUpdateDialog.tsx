import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { exportAll } from '../../db/backupRepo'
import {
  type DeployedContentFile,
  applyDeployedContent,
  dismissContentUpdate,
} from '../../db/deployedContentRepo'
import { downloadJson } from '../../utils/downloadJson'
import { ErrorAlert } from '../common/ErrorAlert'

export function ContentUpdateDialog({
  update,
  localVersion,
  onClose,
}: {
  update: DeployedContentFile | null
  localVersion: number
  onClose: () => void
}) {
  const navigate = useNavigate()
  const [busy, setBusy] = useState<'dismiss' | 'backup' | 'apply' | null>(null)
  const [error, setError] = useState<unknown>(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    setBusy(null)
    setError(null)
    setMessage('')
  }, [update])

  if (!update) return null

  async function handleLater() {
    if (!update) return
    setBusy('dismiss')
    setError(null)
    try {
      await dismissContentUpdate(update.contentVersion)
      onClose()
    } catch (caught) {
      setError(caught)
    } finally {
      setBusy(null)
    }
  }

  async function handleBackup() {
    setBusy('backup')
    setError(null)
    setMessage('')
    try {
      const backup = await exportAll()
      const date = new Date().toISOString().slice(0, 10)
      downloadJson(`kuku-backup-before-update-${date}.json`, backup)
      setMessage(
        'Backup downloaded. You can restore it later from Publish & backup.',
      )
    } catch (caught) {
      setError(caught)
    } finally {
      setBusy(null)
    }
  }

  async function handleApply() {
    if (!update) return
    setBusy('apply')
    setError(null)
    setMessage('')
    try {
      await applyDeployedContent(update)
      onClose()
      navigate('/')
    } catch (caught) {
      setError(caught)
    } finally {
      setBusy(null)
    }
  }

  return (
    <>
      <div className="modal d-block" tabIndex={-1} role="dialog" aria-modal="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title h5">Course content update available</h2>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                disabled={busy !== null}
                onClick={handleLater}
              />
            </div>
            <div className="modal-body">
              <p>
                A newer deployed content version is available: version{' '}
                <strong>{update.contentVersion}</strong>. This browser{' '}
                {localVersion > 0
                  ? `currently has version ${localVersion}`
                  : 'does not have a deployed content version yet'}
                .
              </p>
              <p className="mb-2">
                Updating replaces all courses, lessons, and questions in this browser
                with the deployed content ({update.courses.length} courses,{' '}
                {update.lessons.length} lessons, {update.questions.length} questions).
                Lesson progress is kept where the lesson still exists. Local-only
                courses will be removed.
              </p>
              <p className="text-secondary small">
                Download a backup first if you want to restore the current content
                later. Backups include progress and can be imported from Publish &amp;
                backup.
              </p>

              <ErrorAlert error={error} />
              {message ? (
                <div className="alert alert-success mb-0" role="status">
                  {message}
                </div>
              ) : null}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-outline-secondary"
                disabled={busy !== null}
                onClick={handleLater}
              >
                Later
              </button>
              <button
                type="button"
                className="btn btn-outline-dark"
                disabled={busy !== null}
                onClick={handleBackup}
              >
                {busy === 'backup' ? (
                  <span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />
                ) : null}
                Download backup first
              </button>
              <button
                type="button"
                className="btn btn-kuku"
                disabled={busy !== null}
                onClick={handleApply}
              >
                {busy === 'apply' ? (
                  <span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />
                ) : null}
                Update content
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop show" />
    </>
  )
}
