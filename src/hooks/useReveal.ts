import type { RefObject } from 'react'
import { gsap, useGSAP } from '../lib/gsap'
import { prefersReducedMotion } from '../lib/motion'

/**
 * Fades + lifts every `[data-reveal]` element inside `scope` when it scrolls into view.
 * Use `data-reveal-delay="0.2"` for a per-element delay.
 */
export function useReveal(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      gsap.utils.toArray<HTMLElement>('[data-reveal]', scope.current).forEach((el) => {
        gsap.from(el, {
          y: 56,
          autoAlpha: 0,
          duration: 1.2,
          ease: 'expo.out',
          delay: Number(el.dataset.revealDelay ?? 0),
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        })
      })
    },
    { scope },
  )
}
