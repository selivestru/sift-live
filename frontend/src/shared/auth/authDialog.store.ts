import { create } from 'zustand'

type AuthDialogMode = 'login' | 'register'

interface AuthDialogState {
  isOpen: boolean
  mode: AuthDialogMode
  open: (mode?: AuthDialogMode) => void
  close: () => void
  setMode: (mode: AuthDialogMode) => void
}

export const useAuthDialog = create<AuthDialogState>((set) => ({
  isOpen: false,
  mode: 'login',
  open: (mode = 'login') => set({ isOpen: true, mode }),
  close: () => set({ isOpen: false }),
  setMode: (mode) => set({ mode }),
}))
