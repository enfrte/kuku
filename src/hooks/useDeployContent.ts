import { useLiveQuery } from 'dexie-react-hooks'
import {
  createDeployedContentFile,
  getDeployStatus,
  markDeployedContentPublished,
} from '../db/deployedContentRepo'
import { downloadJson } from '../utils/downloadJson'

export function useDeployContent() {
  const status = useLiveQuery(() => getDeployStatus(), [])

  return {
    status,
    isLoading: status === undefined,
    downloadDeployFile: async () => {
      const file = await createDeployedContentFile()
      downloadJson('deployedContent.json', file)
      await markDeployedContentPublished(file)
      return file
    },
  }
}
