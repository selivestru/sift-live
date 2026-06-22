import { useMutation } from 'urql'

import { useAuthStore } from '~/shared/auth'

import { UPDATE_USER_COLOR_MUTATION } from '../api/change-chat-color.queries'

export const useChangeChatColor = () => {
  const currentColor = useAuthStore((s) => s.user?.color)
  const setUser = useAuthStore((s) => s.setUser)
  const user = useAuthStore((s) => s.user)

  const [{ fetching }, executeUpdate] = useMutation(UPDATE_USER_COLOR_MUTATION)

  const changeColor = async (color: string) => {
    if (!user) return

    const result = await executeUpdate({ input: { color } })

    if (result.data?.updateUserColor) {
      setUser(result.data.updateUserColor)
    }
  }

  return { currentColor, fetching, changeColor }
}
