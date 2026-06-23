import { createFileRoute } from '@tanstack/react-router'

import { StreamPage } from '~/pages/profile'

export const Route = createFileRoute('/profile/stream')({
  component: StreamPage,
})
