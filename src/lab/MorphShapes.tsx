import { useId, useRef, useState } from 'react'
import { gsap, useGSAP } from '../lib/gsap'
import { pad, prefersReducedMotion } from '../lib/motion'

const star = (() => {
  const points: string[] = []
  for (let i = 0; i < 10; i++) {
    const radius = i % 2 === 0 ? 82 : 36
    const angle = -Math.PI / 2 + (i * Math.PI) / 5
    points.push(`${(100 + Math.cos(angle) * radius).toFixed(1)},${(104 + Math.sin(angle) * radius).toFixed(1)}`)
  }
  return `M${points.join(' L')} Z`
})()

const SHAPES = [
  // circle
  'M100,22 C143.1,22 178,56.9 178,100 C178,143.1 143.1,178 100,178 C56.9,178 22,143.1 22,100 C22,56.9 56.9,22 100,22 Z',
  star,
  // heart
  'M100,172 C100,172 26,126 26,76 C26,50 46,32 70,32 C84,32 95,40 100,52 C105,40 116,32 130,32 C154,32 174,50 174,76 C174,126 100,172 100,172 Z',
  // bolt
  'M112,18 L44,112 L94,112 L84,182 L156,84 L106,84 Z',
  // hexagon
  'M100,20 L169.3,60 L169.3,140 L100,180 L30.7,140 L30.7,60 Z',
]

/** Click to morph between shapes (MorphSVG) while an offset outline redraws itself (DrawSVG). */
export function MorphShapes({ label }: { label: string }) {
  const root = useRef<HTMLButtonElement>(null)
  const [index, setIndex] = useState(0)
  const gradientId = `morph-${useId().replace(/[^\w-]/g, '')}`

  const { context } = useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const intro = { trigger: root.current, start: 'top 85%', once: true }
      gsap.from('.morph__outline', { drawSVG: '0%', duration: 1.8, ease: 'power2.inOut', scrollTrigger: intro })
      gsap.from('.morph__fill', {
        scale: 0.4,
        autoAlpha: 0,
        transformOrigin: '50% 50%',
        duration: 1.4,
        ease: 'elastic.out(1, 0.5)',
        delay: 0.2,
        scrollTrigger: intro,
      })
    },
    { scope: root },
  )

  const next = () => {
    const el = root.current
    const fill = el?.querySelector('.morph__fill')
    const outline = el?.querySelector('.morph__outline')
    if (!fill || !outline) return
    const nextIndex = (index + 1) % SHAPES.length
    const shape = SHAPES[nextIndex]
    setIndex(nextIndex)

    context.add(() => {
      gsap.killTweensOf([fill, outline])
      if (prefersReducedMotion()) {
        gsap.set(fill, { morphSVG: shape, scale: 1, autoAlpha: 1 })
        gsap.set(outline, { attr: { d: shape }, drawSVG: '0% 100%' })
        return
      }
      gsap.to(fill, { morphSVG: shape, scale: 1, autoAlpha: 1, duration: 1.1, ease: 'expo.inOut' })
      gsap.set(outline, { attr: { d: shape } })
      gsap.fromTo(outline, { drawSVG: '0% 0%' }, { drawSVG: '0% 100%', duration: 1.4, ease: 'power2.inOut', delay: 0.1 })
      gsap.fromTo(
        '.morph__shape',
        { scale: 0.88, rotate: -8 },
        { scale: 1, rotate: 0, transformOrigin: '50% 50%', duration: 1.4, ease: 'elastic.out(1, 0.45)' },
      )
    })
  }

  return (
    <button
      ref={root}
      type="button"
      className="morph"
      onClick={next}
      aria-label={label}
      data-cursor="label"
      data-cursor-text={label}
    >
      <span className="morph__ring" aria-hidden="true" />
      <svg className="morph__svg" viewBox="0 0 200 200" aria-hidden="true">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" className="morph__stop-a" />
            <stop offset="1" className="morph__stop-b" />
          </linearGradient>
        </defs>
        <g className="morph__shape">
          <path className="morph__fill" d={SHAPES[0]} fill={`url(#${gradientId})`} />
          <path className="morph__outline" d={SHAPES[0]} />
        </g>
      </svg>
      <span className="morph__counter" aria-hidden="true">
        {pad(index + 1)} / {pad(SHAPES.length)}
      </span>
    </button>
  )
}
