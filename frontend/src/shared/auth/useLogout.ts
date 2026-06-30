import { useMutation } from '@apollo/client/react'

import { LOGOUT_MUTATION } from '~/shared/auth/api/logout'
import { useAuthStore } from '~/shared/auth/auth.store'

export const useLogout = () => {
  const storeLogout = useAuthStore((s) => s.logout)
  const [executeLogout] = useMutation(LOGOUT_MUTATION)

  const logout = () => {
    executeLogout()
    storeLogout()
  }

  return logout
}
