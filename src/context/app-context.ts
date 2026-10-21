import { createContext, use } from 'react'
import type { Content, Lang } from '../data/content'

export type Theme = 'dark' | 'light'

export interface AppContextValue {
  lang: Lang
  theme: Theme
  content: Content
  /** True once the preloader has finished — intro animations wait for it. */
  ready: boolean
  markReady: () => void
  toggleLang: () => void
  toggleTheme: (origin?: { x: number; y: number }) => void
}

export const AppContext = createContext<AppContextValue | null>(null)

export function useApp() {
  const value = use(AppContext)
  if (!value) throw new Error('useApp must be used inside <AppProvider>')
  return value
}
