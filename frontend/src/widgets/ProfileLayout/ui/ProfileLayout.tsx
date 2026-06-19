import { useNavigate } from '@tanstack/react-router'
import { useEffect, type ReactNode } from 'react'

import { useAuthStore } from '~/shared/auth'
import { Spinner } from '~/shared/ui/Spinner'

import { ProfileNav } from './ProfileNav'

interface ProfileLayoutProps {
  children: ReactNode
}

export const ProfileLayout = ({ children }: ProfileLayoutProps) => {
  const { isAuthenticated, isLoading } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      void navigate({ to: '/' })
    }
  }, [isAuthenticated, isLoading, navigate])

  if (isLoading) {
    return (
      <div className="grid h-[calc(100dvh-3.5rem)] place-items-center">
        <Spinner className="size-6" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="grid h-[calc(100dvh-3.5rem)] grid-cols-1 lg:grid-cols-[240px_1fr]">
      <ProfileNav />
      <main className="overflow-y-auto p-6" data-slot="profile-layout-content">
        {children}
      </main>
    </div>
  )
}
