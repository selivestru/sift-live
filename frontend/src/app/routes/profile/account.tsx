import { createFileRoute } from '@tanstack/react-router'

import { AccountPage } from '~/pages/profile'

export const Route = createFileRoute('/profile/account')({
  component: AccountPage,
})
