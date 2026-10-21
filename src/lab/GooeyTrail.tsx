import { useEffect, useId, useRef, type CSSProperties } from 'react'
import { gsap } from '../lib/gsap'
import { damp, prefersReducedMotion } from '../lib/motion'

const TRAIL = 14
const DROPS = [
  { cx: '18%', cy: '30%', r: 24 },
  { cx: '80%', cy: '70%', r: 34 },
  { cx: '68%', cy: '22%', r: 16 },
]

/** A chain of circles chasing the pointer, fused into one liquid shape by an SVG "goo" filter. */
export function GooeyTrail() {
  const svgRef = useRef<SVGSVGElement>(null)
  const filterId = `goo-${useId().replace(/[^\w-]/g, '')}`

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return
    // Rendered tail-first so the head paints on top; index 0 here is the head.
    const circles = Array.from(svg.querySelectorAll<SVGCircleElement>('.goo__trail')).reverse()
    const points = circles.map(() => ({ x: 0, y: 0 }))
    const pointer = { x: 0, y: 0, inside: false }
    const reduce = prefersReducedMotion()
    let width = 0
    let height = 0
    let time = Math.random() * 10
    let visible = false
    let running = false

    const render = () => {
      for (let i = 0; i < circles.length; i++) {
        circles[i].setAttribute('cx', points[i].x.toFixed(1))
        circles[i].setAttribute('cy', points[i].y.toFixed(1))
      }
    }

    const tick = (_time: number, deltaMs: number) => {
      const dt = Math.min(deltaMs / 1000, 1 / 20)
      time += dt
      // Idle: wander along a Lissajous curve until the pointer comes in.
      const targetX = pointer.inside ? pointer.x : width / 2 + Math.sin(time * 0.9) * width * 0.3
      const targetY = pointer.inside ? pointer.y : height / 2 + Math.sin(time * 1.6) * height * 0.24
      for (let i = 0; i < points.length; i++) {
        const leadX = i === 0 ? targetX : points[i - 1].x
        const leadY = i === 0 ? targetY : points[i - 1].y
        const k = damp(i === 0 ? 0.18 : 0.35, dt)
        points[i].x += (leadX - points[i].x) * k
        points[i].y += (leadY - points[i].y) * k
      }
      render()
    }

    const sync = () => {
      const shouldRun = width > 0 && visible && !document.hidden && (!reduce || pointer.inside)
      if (shouldRun === running) return
      running = shouldRun
      if (running) gsap.ticker.add(tick)
      else gsap.ticker.remove(tick)
    }

    const resize = () => {
      const rect = svg.getBoundingClientRect()
      const first = width === 0
      width = rect.width
      height = rect.height
      if (first) {
        for (const point of points) {
          point.x = width / 2
          point.y = height / 2
        }
        render()
      }
      sync()
    }

    const onMove = (event: PointerEvent) => {
      const rect = svg.getBoundingClientRect()
      pointer.x = event.clientX - rect.left
      pointer.y = event.clientY - rect.top
      pointer.inside = true
      sync()
    }
    const onLeave = () => {
      pointer.inside = false
      sync()
    }

    const resizeObserver = new ResizeObserver(resize)
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      sync()
    })
    resizeObserver.observe(svg)
    intersectionObserver.observe(svg)
    document.addEventListener('visibilitychange', sync)
    svg.addEventListener('pointermove', onMove)
    svg.addEventListener('pointerdown', onMove)
    svg.addEventListener('pointerleave', onLeave)
    svg.addEventListener('pointercancel', onLeave)
    return () => {
      gsap.ticker.remove(tick)
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      document.removeEventListener('visibilitychange', sync)
      svg.removeEventListener('pointermove', onMove)
      svg.removeEventListener('pointerdown', onMove)
      svg.removeEventListener('pointerleave', onLeave)
      svg.removeEventListener('pointercancel', onLeave)
    }
  }, [])

  return (
    <svg ref={svgRef} className="goo" aria-hidden="true">
      <defs>
        <filter
          id={filterId}
          x="0"
          y="0"
          width="100%"
          height="100%"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
          <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9" result="goo" />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>
      </defs>
      <g filter={`url(#${filterId})`}>
        {DROPS.map((drop, index) => (
          <circle key={`drop-${index}`} className="goo__drop" cx={drop.cx} cy={drop.cy} r={drop.r} />
        ))}
        {Array.from({ length: TRAIL }, (_, k) => {
          const index = TRAIL - 1 - k
          return (
            <circle
              key={index}
              className="goo__trail"
              r={34 - index * 1.8}
              style={{ '--t': index / (TRAIL - 1) } as CSSProperties}
            />
          )
        })}
      </g>
    </svg>
  )
}
