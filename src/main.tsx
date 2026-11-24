import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/varela-round/400.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './styles.css'
import { registerSW } from 'virtual:pwa-register'
import App from './App'
import { initializeContent } from './db/deployedContentRepo'

registerSW({ immediate: true })

const container = document.getElementById('root')
if (!container) throw new Error('Root element not found.')

const root = createRoot(container)

async function bootstrap() {
  try {
    const { pendingUpdate, localVersion } = await initializeContent()
    root.render(
      <StrictMode>
        <App
          initialContentUpdate={pendingUpdate}
          localContentVersion={localVersion}
        />
      </StrictMode>,
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    root.render(
      <div className="container py-5">
        <div className="alert alert-danger">
          <h1 className="h4">kuku could not open its local database</h1>
          <p className="mb-1">{message}</p>
          <p className="mb-0">
            IndexedDB may be disabled or unavailable in this browser mode. Try a normal
            browser window and reload.
          </p>
        </div>
      </div>,
    )
  }
}

void bootstrap()
