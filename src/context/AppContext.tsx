import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { flushSync } from 'react-dom'
import { ai3dContent } from '../data/ai3dContent'
import { content as contentByLang, type Lang, type Track } from '../data/content'
import { ScrollTrigger } from '../lib/gsap'
import { prefersReducedMotion } from '../lib/motion'
import { jumpTo } from '../lib/scroll'
import { AppContext, type Theme } from './app-context'

const THEME_KEY = 'mp-theme'
const LANG_KEY = 'mp-lang'
const AI3D_PARAM_VALUES = new Set(['ai3d', '3d', 'blender'])

/** 从 URL 查询参数解析当前内容轨道，未传或未知参数时默认返回原版简历 */
function resolveTrack(): Track {
  try {
    const params = new URLSearchParams(window.location.search)
    for (const key of ['track', 'mode', 'v']) {
      const value = params.get(key)?.trim().toLowerCase()
      if (value && AI3D_PARAM_VALUES.has(value)) return 'ai3d'
    }
  } catch {
    // 忽略异常查询参数，回退默认简历
  }
  return 'default'
}

function readStorage(key: string) {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function writeStorage(key: string, value: string) {
  try {
    localStorage.setItem(key, value)
  } catch {
    // Storage can be unavailable (privacy mode); the preference just won't persist.
  }
}

function initialTheme(): Theme {
  const fromDom = document.documentElement.dataset.theme
  return fromDom === 'light' ? 'light' : 'dark'
}

function initialLang(): Lang {
  const saved = readStorage(LANG_KEY)
  if (saved === 'zh' || saved === 'en') return saved
  return navigator.language.toLowerCase().startsWith('zh') ? 'zh' : 'en'
}

interface TransitionOptions {
  /** Class put on <html> for the duration of the transition, to style its pseudo-elements. */
  className?: string
  animate?: () => void
}

function withViewTransition(update: () => void, { className, animate }: TransitionOptions = {}) {
  if (typeof document.startViewTransition !== 'function' || prefersReducedMotion()) {
    update()
    return
  }
  const root = document.documentElement
  if (className) root.classList.add(className)
  const transition = document.startViewTransition(update)
  if (animate) transition.ready.then(animate).catch(() => {})
  if (className) {
    const cleanup = () => root.classList.remove(className)
    transition.finished.then(cleanup, cleanup)
  }
}

interface ScrollAnchor {
  id: string
  top: number
}

/** The section currently at the top of the viewport. */
function captureScrollAnchor(): ScrollAnchor | null {
  for (const section of document.querySelectorAll<HTMLElement>('main section[id]')) {
    const rect = section.getBoundingClientRect()
    if (rect.bottom > 0) return { id: section.id, top: rect.top }
  }
  return null
}

/**
 * Re-rendering every section in another language changes their heights (and briefly removes the
 * projects pin spacer), so put the anchored section back where the reader left it.
 */
function restoreScrollAnchor(anchor: ScrollAnchor | null) {
  const section = anchor && document.getElementById(anchor.id)
  if (!anchor || !section) return
  const delta = section.getBoundingClientRect().top - anchor.top
  if (Math.abs(delta) >= 1) jumpTo(window.scrollY + delta)
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(initialLang)
  const [track] = useState<Track>(resolveTrack)
  const [theme, setTheme] = useState<Theme>(initialTheme)
  const [ready, setReady] = useState(false)
  const [activeModelId, setActiveModelId] = useState<string | null>(null)
  const content = (track === 'ai3d' ? ai3dContent : contentByLang)[lang]

  useEffect(() => {
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en'
    document.documentElement.dataset.track = track
    document.title = content.meta.title
    document.querySelector('meta[name="description"]')?.setAttribute('content', content.meta.description)
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', content.meta.title)
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', content.meta.description)
    writeStorage(LANG_KEY, lang)
  }, [lang, track, content])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#0b0b0e' : '#f4f1ea')
    writeStorage(THEME_KEY, theme)
  }, [theme])

  const toggleTheme = useCallback(
    (origin?: { x: number; y: number }) => {
      const next: Theme = theme === 'dark' ? 'light' : 'dark'
      const x = origin?.x ?? window.innerWidth - 40
      const y = origin?.y ?? 40
      const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))
      withViewTransition(
        () => {
          document.documentElement.dataset.theme = next
          flushSync(() => setTheme(next))
        },
        {
          className: 'vt-theme',
          animate: () => {
            document.documentElement.animate(
              { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
              { duration: 800, easing: 'cubic-bezier(0.65, 0, 0.35, 1)', pseudoElement: '::view-transition-new(root)' },
            )
          },
        },
      )
    },
    [theme],
  )

  const toggleLang = useCallback(() => {
    withViewTransition(() => {
      const anchor = captureScrollAnchor()
      flushSync(() => setLang((current) => (current === 'zh' ? 'en' : 'zh')))
      ScrollTrigger.refresh()
      restoreScrollAnchor(anchor)
    })
  }, [])

  const markReady = useCallback(() => setReady(true), [])

  const openModelViewer = useCallback(
    (projectId?: string) => {
      const firstModel = content.projects.items.find((item) => Boolean(item.modelUrl))
      const targetId = projectId ?? firstModel?.id ?? null
      if (targetId) setActiveModelId(targetId)
    },
    [content.projects.items],
  )

  const closeModelViewer = useCallback(() => setActiveModelId(null), [])

  const value = useMemo(
    () => ({
      lang,
      track,
      theme,
      content,
      ready,
      activeModelId,
      markReady,
      toggleLang,
      toggleTheme,
      openModelViewer,
      closeModelViewer,
    }),
    [lang, track, theme, content, ready, activeModelId, markReady, toggleLang, toggleTheme, openModelViewer, closeModelViewer],
  )

  return <AppContext value={value}>{children}</AppContext>
}
