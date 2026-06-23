import { Link } from '@tanstack/react-router'
import { TvIcon, UserRoundIcon } from 'lucide-react'
import { useIntlayer } from 'react-intlayer'

const navItems = [
  { to: '/profile/account', icon: UserRoundIcon, key: 'account' as const },
  { to: '/profile/stream', icon: TvIcon, key: 'stream' as const },
]

export const ProfileLayout = ({ children }: { children: React.ReactNode }) => {
  const t = useIntlayer('profile')

  return (
    <div className="grid h-[calc(100dvh-3.5rem)] grid-cols-1 lg:grid-cols-[260px_1fr]">
      <aside
        className="bg-background hidden flex-col overflow-y-auto border-r lg:flex"
        data-slot="profile-layout-sidebar"
      >
        <nav className="flex flex-col gap-0.5 p-2">
          {navItems.map(({ to, icon: Icon, key }) => (
            <Link
              key={to}
              to={to}
              className="hover:bg-accent aria-[current=page]:bg-accent aria-[current=page]:text-accent-foreground flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors"
            >
              <Icon className="size-4" />
              {t[key]}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="relative flex flex-col overflow-y-auto" data-slot="profile-layout-content">
        {children}
      </main>
    </div>
  )
}
