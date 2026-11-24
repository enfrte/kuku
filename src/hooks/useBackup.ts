import {
  type BackupFile,
  exportAll,
  importAll,
  resetAll,
} from '../db/backupRepo'
import { loadDemoCourse } from '../db/seedRepo'

export function useBackup() {
  return {
    exportAll: (): Promise<BackupFile> => exportAll(),
    importAll: (file: unknown): Promise<void> => importAll(file),
    resetAll: (): Promise<void> => resetAll(),
    loadDemoCourse: (): Promise<number> => loadDemoCourse(),
  }
}
