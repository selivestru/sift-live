import { ActiveChannels } from './ActiveChannels'
import { FollowedChannels } from './FollowedChannels'

export const FollowedStreamersSidebar = () => {
  return (
    <aside
      data-slot="main-layout-sidebar"
      className="bg-background hidden flex-col overflow-y-auto border-r lg:flex"
    >
      <FollowedChannels />
      <ActiveChannels />
    </aside>
  )
}
