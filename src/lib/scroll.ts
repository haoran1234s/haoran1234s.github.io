import Lenis from 'lenis'
import { gsap, ScrollTrigger } from './gsap'
import { prefersReducedMotion } from './motion'

let lenis: Lenis | null = null
let ticker: ((time: number) => void) | null = null
let lockCount = 0

/** Smooth scrolling driven by GSAP's ticker so Lenis and ScrollTrigger share a single frame loop. */
export function initSmoothScroll() {
  if (lenis || prefersReducedMotion()) return lenis
  lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, autoRaf: false })
  lenis.on('scroll', ScrollTrigger.update)
  ticker = (time: number) => lenis?.raf(time * 1000)
  gsap.ticker.add(ticker)
  gsap.ticker.lagSmoothing(0)
  // A lock taken before Lenis existed (e.g. by the preloader) must still apply.
  if (lockCount > 0) lenis.stop()
  return lenis
}

export function destroySmoothScroll() {
  if (ticker) gsap.ticker.remove(ticker)
  lenis?.destroy()
  lenis = null
  ticker = null
}

export const getLenis = () => lenis

export function scrollToTarget(target: string | number | HTMLElement, offset = 0) {
  if (lenis) {
    lenis.scrollTo(target, { offset, duration: 1.4, easing: (t) => 1 - Math.pow(1 - t, 4) })
    return
  }
  let y: number
  if (typeof target === 'number') {
    y = target
  } else {
    const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target
    if (!el) return
    y = el.getBoundingClientRect().top + window.scrollY + offset
  }
  window.scrollTo({ top: y, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
}

/** Jumps to `y` without animating, keeping Lenis' internal position in sync. */
export function jumpTo(y: number) {
  if (lenis) lenis.scrollTo(y, { immediate: true, force: true })
  else window.scrollTo(0, y)
}

/** Reference-counted scroll lock used by the preloader, the mobile menu and the project modal. */
export function lockScroll(locked: boolean) {
  lockCount = Math.max(0, lockCount + (locked ? 1 : -1))
  const isLocked = lockCount > 0
  document.documentElement.classList.toggle('is-locked', isLocked)
  if (isLocked) lenis?.stop()
  else lenis?.start()
}
