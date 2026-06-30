import { useMutation } from 'urql'

import { RESET_STREAM_KEY_MUTATION } from '../api/reset-stream-key.queries'

export const useResetStreamKey = () => {
  const [{ fetching, data, error }, executeReset] = useMutation(RESET_STREAM_KEY_MUTATION)

  const reset = async () => {
    const result = await executeReset({})
    return result.data?.resetStreamKey?.streamKey ?? null
  }

  return { reset, fetching, newKey: data?.resetStreamKey ?? null, error }
}
