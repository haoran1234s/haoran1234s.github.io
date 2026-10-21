export const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

export const lerp = (from: number, to: number, t: number) => from + (to - from) * t

/** Frame-rate independent lerp factor: `rate` is the fraction covered per 60fps frame. */
export const damp = (rate: number, dt: number) => 1 - Math.pow(1 - rate, dt * 60)

export const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const hasFinePointer = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches

export const readCssVar = (name: string, el: Element = document.documentElement) =>
  getComputedStyle(el).getPropertyValue(name).trim()

/** Calls `callback` whenever <html data-theme> changes. Returns an unsubscribe function. */
export function onThemeChange(callback: () => void) {
  const observer = new MutationObserver(callback)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
  return () => observer.disconnect()
}

export const isCJK = (text: string) => /[\u3040-\u30ff\u3400-\u9fff\uac00-\ud7af]/.test(text)

export const pad = (n: number, length = 2) => String(n).padStart(length, '0')
