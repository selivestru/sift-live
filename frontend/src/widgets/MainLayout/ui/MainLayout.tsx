import type React from 'react'

import { FollowedStreamersSidebar } from './FollowedStreamersSidebar'

export const MainLayout = ({ children }: React.PropsWithChildren) => (
  <div className="grid h-[calc(100dvh-3.5rem)] grid-cols-1 lg:grid-cols-[260px_1fr]">
    <FollowedStreamersSidebar />
    <main className="relative flex flex-col overflow-y-auto" data-slot="main-layout-content">
      {children}
    </main>
  </div>
)
