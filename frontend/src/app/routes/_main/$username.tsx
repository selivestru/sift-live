import { createFileRoute } from '@tanstack/react-router'

import { ChannelPage } from '~/pages/channel'

export const Route = createFileRoute('/_main/$username')({
  component: ChannelRoute,
})

function ChannelRoute() {
  const { username } = Route.useParams()

  return <ChannelPage username={username} />
}
