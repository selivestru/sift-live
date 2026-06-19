import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

import { useAuthStore } from '~/shared/auth'
import { ProfileLayout } from '~/widgets/ProfileLayout'

export const Route = createFileRoute('/profile/')({
  beforeLoad: ({ location }) => {
    const { token, isLoading } = useAuthStore.getState()

    if (!isLoading && !token) {
      throw redirect({
        to: '/',
        search: { from: location.href },
      })
    }
  },
  component: ProfileLayoutRoute,
})

function ProfileLayoutRoute() {
  return (
    <ProfileLayout>
      <Outlet />
    </ProfileLayout>
  )
}
