import { Link } from '@tanstack/react-router'
import { BellIcon, SettingsIcon, ShieldIcon, TvIcon, UserRoundIcon } from 'lucide-react'
import { useIntlayer } from 'react-intlayer'

const navItems = [
  { to: '/profile/account', icon: UserRoundIcon, key: 'account' },
  { to: '/profile/channel', icon: TvIcon, key: 'channel' },
  { to: '/profile/stream-settings', icon: SettingsIcon, key: 'streamSettings' },
  { to: '/profile/notifications', icon: BellIcon, key: 'notifications' },
  { to: '/profile/security', icon: ShieldIcon, key: 'security' },
] as const

export const ProfileNav = () => {
  const t = useIntlayer('profile-layout')

  return (
    <nav
      className="bg-background flex h-full flex-col gap-1 overflow-y-auto border-r p-3"
      data-slot="profile-nav"
      aria-label={t.settings.value}
    >
      <h2 className="text-muted-foreground px-2 py-2 text-xs font-semibold tracking-wider uppercase">
        {t.settings}
      </h2>
      <ul className="flex flex-col gap-0.5">
        {navItems.map(({ to, icon: Icon, key }) => (
          <li key={to}>
            <Link
              to={to}
              activeOptions={{ exact: true }}
              activeProps={{
                className: 'bg-accent text-accent-foreground',
              }}
              className="hover:bg-accent hover:text-accent-foreground flex items-center gap-2 rounded-md px-2 py-2 text-sm font-medium transition-colors"
            >
              <Icon className="size-4" />
              {t[key]}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
