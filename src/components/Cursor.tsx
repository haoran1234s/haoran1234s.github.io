import { useEffect, useRef, useState } from 'react'
import { gsap } from '../lib/gsap'
import { hasFinePointer, prefersReducedMotion } from '../lib/motion'
import './Cursor.css'

const INTERACTIVE = 'a, button, [data-cursor], label, summary'

/**
 * A two-part cursor: a precise dot plus a lagging ring that morphs depending on what is hovered.
 * Elements opt into richer states with `data-cursor="view" | "label" | "drag" | "dot" | "hide"`
 * and an optional `data-cursor-text`.
 */
export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)
  const [enabled] = useState(() => hasFinePointer() && !prefersReducedMotion())

  useEffect(() => {
    const dot = dotRef.current
    const ring = ringRef.current
    const label = labelRef.current
    if (!enabled || !dot || !ring || !label) return
    const root = document.documentElement
    root.classList.add('has-custom-cursor')

    gsap.set([dot, ring], { xPercent: -50, yPercent: -50, x: -100, y: -100 })
    const dotX = gsap.quickTo(dot, 'x', { duration: 0.15, ease: 'power3' })
    const dotY = gsap.quickTo(dot, 'y', { duration: 0.15, ease: 'power3' })
    const ringX = gsap.quickTo(ring, 'x', { duration: 0.55, ease: 'power3' })
    const ringY = gsap.quickTo(ring, 'y', { duration: 0.55, ease: 'power3' })

    let current: Element | null = null
    let visible = false

    const setTarget = (target: Element | null) => {
      if (target === current) return
      current = target
      const state = target ? (target.getAttribute('data-cursor') ?? 'link') : ''
      ring.dataset.state = state
      dot.dataset.state = state
      label.textContent = target?.getAttribute('data-cursor-text') ?? ''
    }

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      if (!visible) {
        visible = true
        root.classList.add('cursor-visible')
        gsap.set([dot, ring], { x: event.clientX, y: event.clientY })
      }
      dotX(event.clientX)
      dotY(event.clientY)
      ringX(event.clientX)
      ringY(event.clientY)
      const target = event.target instanceof Element ? event.target.closest(INTERACTIVE) : null
      setTarget(target)
    }
    const onDown = () => root.classList.add('cursor-down')
    const onUp = () => root.classList.remove('cursor-down')
    const onLeave = () => {
      visible = false
      root.classList.remove('cursor-visible')
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    root.addEventListener('mouseleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      root.removeEventListener('mouseleave', onLeave)
      root.classList.remove('has-custom-cursor', 'cursor-visible', 'cursor-down')
      gsap.killTweensOf([dot, ring])
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <>
      <div ref={ringRef} className="cursor cursor--ring" aria-hidden="true">
        <span ref={labelRef} className="cursor__label" />
      </div>
      <div ref={dotRef} className="cursor cursor--dot" aria-hidden="true" />
    </>
  )
}
