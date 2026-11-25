import { createContext, use } from 'react'
import type { Content, Lang, Track } from '../data/content'

export type Theme = 'dark' | 'light'

export interface AppContextValue {
  lang: Lang
  track: Track
  theme: Theme
  content: Content
  /** True once the preloader has finished — intro animations wait for it. */
  ready: boolean
  /** 当前打开的 3D 模型检视弹框对应的项目 ID */
  activeModelId: string | null
  markReady: () => void
  toggleLang: () => void
  toggleTheme: (origin?: { x: number; y: number }) => void
  openModelViewer: (projectId?: string) => void
  closeModelViewer: () => void
}

export const AppContext = createContext<AppContextValue | null>(null)

export function useApp() {
  const value = use(AppContext)
  if (!value) throw new Error('useApp must be used inside <AppProvider>')
  return value
}
