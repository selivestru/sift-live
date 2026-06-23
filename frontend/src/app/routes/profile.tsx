import { createFileRoute, Outlet } from '@tanstack/react-router'

import { ProfileLayout } from '~/widgets/ProfileLayout'

export const Route = createFileRoute('/profile')({
  component: ProfileRoute,
})

function ProfileRoute() {
  return (
    <ProfileLayout>
      <Outlet />
    </ProfileLayout>
  )
}
