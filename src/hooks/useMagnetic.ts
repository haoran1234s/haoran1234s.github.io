import { useEffect, type RefObject } from 'react'
import { gsap } from '../lib/gsap'
import { hasFinePointer, prefersReducedMotion } from '../lib/motion'

/**
 * Pulls the element (and an optional `[data-magnetic-inner]` child, a little further)
 * towards the pointer while hovering.
 */
export function useMagnetic(ref: RefObject<HTMLElement | null>, strength = 0.35) {
  useEffect(() => {
    const el = ref.current
    if (!el || !hasFinePointer() || prefersReducedMotion()) return
    const inner = el.querySelector<HTMLElement>('[data-magnetic-inner]')
    const targets = inner ? [el, inner] : [el]
    const settings = { duration: 0.7, ease: 'power3.out' }
    const xTo = gsap.quickTo(el, 'x', settings)
    const yTo = gsap.quickTo(el, 'y', settings)
    const innerXTo = inner ? gsap.quickTo(inner, 'x', settings) : null
    const innerYTo = inner ? gsap.quickTo(inner, 'y', settings) : null

    const onMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect()
      const dx = event.clientX - (rect.left + rect.width / 2)
      const dy = event.clientY - (rect.top + rect.height / 2)
      xTo(dx * strength)
      yTo(dy * strength)
      innerXTo?.(dx * strength * 0.45)
      innerYTo?.(dy * strength * 0.45)
    }
    const onLeave = () => {
      xTo(0)
      yTo(0)
      innerXTo?.(0)
      innerYTo?.(0)
    }

    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    return () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
      gsap.killTweensOf(targets)
      gsap.set(targets, { clearProps: 'transform' })
    }
  }, [ref, strength])
}
