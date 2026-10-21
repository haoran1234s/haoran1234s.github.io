import { useEffect, type RefObject } from 'react'
import { gsap } from '../lib/gsap'
import { onThemeChange, prefersReducedMotion, readCssVar } from '../lib/motion'

export interface SketchPalette {
  fg: string
  faint: string
  accent: string
  accent2: string
  accent3: string
}

export interface SketchContext {
  ctx: CanvasRenderingContext2D
  /** Size in CSS pixels; the context is already scaled for the device pixel ratio. */
  width: number
  height: number
  pointer: { x: number; y: number; inside: boolean; down: boolean }
  palette: SketchPalette
  reducedMotion: boolean
}

export interface Sketch {
  resize?(c: SketchContext): void
  frame(c: SketchContext, dt: number, time: number): void
  pointerDown?(c: SketchContext): void
}

const readPalette = (el: Element): SketchPalette => ({
  fg: readCssVar('--fg', el),
  faint: readCssVar('--fg-faint', el),
  // The "ink" variant stays legible on the light theme, where the raw accent is too pale.
  accent: readCssVar('--accent-ink', el),
  accent2: readCssVar('--accent-2', el),
  accent3: readCssVar('--accent-3', el),
})

/**
 * Runs a canvas sketch on GSAP's ticker. Handles DPR, resizing, pointer tracking, theme changes,
 * and pauses whenever the canvas is off-screen or the tab is hidden. With reduced motion the
 * loop only runs while the pointer is inside the canvas.
 */
export function useSketch(canvasRef: RefObject<HTMLCanvasElement | null>, create: () => Sketch) {
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const sketch = create()
    const c: SketchContext = {
      ctx,
      width: 0,
      height: 0,
      pointer: { x: 0, y: 0, inside: false, down: false },
      palette: readPalette(canvas),
      reducedMotion: prefersReducedMotion(),
    }
    let dpr = 0
    let visible = false
    let running = false

    const tick = (time: number, deltaMs: number) => sketch.frame(c, Math.min(deltaMs / 1000, 1 / 20), time)

    const sync = () => {
      const shouldRun = c.width > 0 && visible && !document.hidden && (!c.reducedMotion || c.pointer.inside)
      if (shouldRun === running) return
      running = shouldRun
      if (running) gsap.ticker.add(tick)
      else gsap.ticker.remove(tick)
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const width = Math.max(1, Math.round(rect.width))
      const height = Math.max(1, Math.round(rect.height))
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      if (width === c.width && height === c.height && ratio === dpr) return
      c.width = width
      c.height = height
      dpr = ratio
      canvas.width = Math.round(width * ratio)
      canvas.height = Math.round(height * ratio)
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
      sketch.resize?.(c)
      sketch.frame(c, 0, gsap.ticker.time)
      sync()
    }

    const toLocal = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      c.pointer.x = event.clientX - rect.left
      c.pointer.y = event.clientY - rect.top
    }
    const onMove = (event: PointerEvent) => {
      toLocal(event)
      c.pointer.inside = true
      sync()
    }
    const onDown = (event: PointerEvent) => {
      toLocal(event)
      c.pointer.inside = true
      c.pointer.down = true
      sketch.pointerDown?.(c)
      sync()
    }
    const onUp = () => {
      c.pointer.down = false
    }
    const onLeave = () => {
      c.pointer.inside = false
      c.pointer.down = false
      sync()
    }

    const resizeObserver = new ResizeObserver(resize)
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      sync()
    })
    const stopThemeWatch = onThemeChange(() => {
      c.palette = readPalette(canvas)
      if (!running) sketch.frame(c, 0, gsap.ticker.time)
    })

    resizeObserver.observe(canvas)
    intersectionObserver.observe(canvas)
    document.addEventListener('visibilitychange', sync)
    canvas.addEventListener('pointermove', onMove)
    canvas.addEventListener('pointerdown', onDown)
    canvas.addEventListener('pointerup', onUp)
    canvas.addEventListener('pointerleave', onLeave)
    canvas.addEventListener('pointercancel', onLeave)

    return () => {
      gsap.ticker.remove(tick)
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      stopThemeWatch()
      document.removeEventListener('visibilitychange', sync)
      canvas.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('pointerdown', onDown)
      canvas.removeEventListener('pointerup', onUp)
      canvas.removeEventListener('pointerleave', onLeave)
      canvas.removeEventListener('pointercancel', onLeave)
    }
  }, [canvasRef, create])
}
