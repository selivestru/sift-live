import { useMutation } from '@apollo/client/react'

import { RESET_STREAM_KEY_MUTATION } from '../api/reset-stream-key.queries'

export const useResetStreamKey = () => {
  const [executeReset, { loading, data, error }] = useMutation(RESET_STREAM_KEY_MUTATION)

  const reset = async () => {
    const result = await executeReset()
    return result.data?.resetStreamKey?.streamKey ?? null
  }

  return { reset, fetching: loading, newKey: data?.resetStreamKey ?? null, error }
}
