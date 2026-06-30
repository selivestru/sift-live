import { useMutation } from '@apollo/client/react'

import { useAuthStore } from '~/shared/auth'

import { UPDATE_USER_COLOR_MUTATION } from '../api/change-chat-color.queries'

export const useChangeChatColor = () => {
  const currentColor = useAuthStore((s) => s.user?.color)
  const setUser = useAuthStore((s) => s.setUser)

  const [executeUpdate, { loading }] = useMutation(UPDATE_USER_COLOR_MUTATION)

  const changeColor = async (color: string) => {
    const hasUser = !!useAuthStore.getState().user

    if (!hasUser) return

    const result = await executeUpdate({ variables: { input: { color } } })

    if (result.data?.updateUserColor) {
      setUser(result.data.updateUserColor)
    }
  }

  return { currentColor, fetching: loading, changeColor }
}
