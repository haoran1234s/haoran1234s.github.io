import { useRef } from 'react'
import { gsap, useGSAP } from '../lib/gsap'

export function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    gsap.to(bar.current, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: { start: 0, end: 'max', scrub: 0.3 },
    })
  })

  return (
    <div className="scroll-progress" aria-hidden="true">
      <div ref={bar} className="scroll-progress__bar" />
    </div>
  )
}
