import { useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { clamp, damp, prefersReducedMotion } from '../lib/motion'

interface TagSphereProps {
  tags: string[]
  highlight: string | null
  dragLabel: string
}

interface Point {
  x: number
  y: number
  z: number
}

const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5))
const IDLE_SPIN = 0.0032
const MAX_SPIN = 0.12

/** Evenly distributes `count` points on a unit sphere (Fibonacci lattice). */
function fibonacciSphere(count: number): Point[] {
  return Array.from({ length: count }, (_, i) => {
    const y = count === 1 ? 0 : 1 - (i / (count - 1)) * 2
    const radius = Math.sqrt(1 - y * y)
    const theta = GOLDEN_ANGLE * i
    return { x: Math.cos(theta) * radius, y, z: Math.sin(theta) * radius }
  })
}

/**
 * Screen-space convention: x → right, y → down, z → towards the viewer.
 * `ax` spins around the horizontal axis (vertical drags), `ay` around the vertical axis (horizontal drags).
 */
function rotate(points: Point[], ax: number, ay: number) {
  const cosX = Math.cos(ax)
  const sinX = Math.sin(ax)
  const cosY = Math.cos(ay)
  const sinY = Math.sin(ay)
  for (const p of points) {
    const x1 = p.x * cosY + p.z * sinY
    const z1 = -p.x * sinY + p.z * cosY
    const y2 = p.y * cosX + z1 * sinX
    const z2 = -p.y * sinX + z1 * cosX
    p.x = x1
    p.y = y2
    p.z = z2
  }
}

/** A draggable 3D cloud of tags rendered with plain DOM + transforms. */
export function TagSphere({ tags, highlight, dragLabel }: TagSphereProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const highlightRef = useRef(highlight)

  useEffect(() => {
    highlightRef.current = highlight
  }, [highlight])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const items = Array.from(root.querySelectorAll<HTMLElement>('.sphere__tag'))
    const points = fibonacciSphere(items.length)
    const reduce = prefersReducedMotion()

    let radius = 0
    let spinX = reduce ? 0 : IDLE_SPIN * 0.4
    let spinY = reduce ? 0 : IDLE_SPIN
    let hoverX = 0
    let hoverY = 0
    let dragging = false
    let lastX = 0
    let lastY = 0
    let visible = false
    let running = false

    const measure = () => {
      radius = root.clientWidth * 0.39
    }

    const render = () => {
      const active = highlightRef.current
      for (let i = 0; i < items.length; i++) {
        const p = points[i]
        const depth = (p.z + 1) / 2
        const scale = 0.5 + depth * 0.72
        const el = items[i]
        el.style.transform = `translate3d(${p.x * radius}px, ${p.y * radius}px, 0) translate(-50%, -50%) scale(${scale})`
        el.style.opacity = String(0.14 + depth * 0.86)
        el.style.zIndex = String(Math.round(depth * 100))
        el.classList.toggle('is-highlight', el.dataset.tag === active)
      }
    }

    const tick = (_time: number, deltaMs: number) => {
      const frames = Math.min(deltaMs / 16.667, 4)
      const active = highlightRef.current
      const target = active ? items.findIndex((el) => el.dataset.tag === active) : -1

      if (!dragging) {
        if (target >= 0) {
          // Steer the highlighted tag towards the front-centre of the sphere.
          const p = points[target]
          const yaw = Math.atan2(p.x, p.z)
          const pitch = Math.atan2(p.y, Math.hypot(p.x, p.z))
          spinY = clamp(-yaw * 0.12, -MAX_SPIN, MAX_SPIN)
          spinX = clamp(-pitch * 0.12, -MAX_SPIN, MAX_SPIN)
        } else if (!reduce) {
          const k = damp(0.04, deltaMs / 1000)
          spinY += (IDLE_SPIN + hoverY * 0.03 - spinY) * k
          spinX += (IDLE_SPIN * 0.4 + hoverX * 0.03 - spinX) * k
        } else {
          spinX *= 0.9
          spinY *= 0.9
        }
        rotate(points, spinX * frames, spinY * frames)
      }
      render()
    }

    const sync = () => {
      const shouldRun = visible && !document.hidden
      if (shouldRun === running) return
      running = shouldRun
      if (running) gsap.ticker.add(tick)
      else gsap.ticker.remove(tick)
    }

    const onDown = (event: PointerEvent) => {
      dragging = true
      lastX = event.clientX
      lastY = event.clientY
      root.setPointerCapture(event.pointerId)
      root.classList.add('is-dragging')
    }
    const onMove = (event: PointerEvent) => {
      if (dragging) {
        const dx = event.clientX - lastX
        const dy = event.clientY - lastY
        lastX = event.clientX
        lastY = event.clientY
        const k = 1 / Math.max(radius, 1)
        spinY = clamp(dx * k, -MAX_SPIN * 2, MAX_SPIN * 2)
        spinX = clamp(dy * k, -MAX_SPIN * 2, MAX_SPIN * 2)
        rotate(points, spinX, spinY)
        if (!running) render()
        return
      }
      if (event.pointerType !== 'mouse') return
      const rect = root.getBoundingClientRect()
      hoverY = clamp((event.clientX - rect.left) / rect.width - 0.5, -0.5, 0.5)
      hoverX = clamp((event.clientY - rect.top) / rect.height - 0.5, -0.5, 0.5)
    }
    const onUp = (event: PointerEvent) => {
      dragging = false
      root.classList.remove('is-dragging')
      if (root.hasPointerCapture(event.pointerId)) root.releasePointerCapture(event.pointerId)
    }
    const onLeave = () => {
      hoverX = 0
      hoverY = 0
    }

    const resizeObserver = new ResizeObserver(() => {
      measure()
      render()
    })
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      sync()
    })

    measure()
    render()
    resizeObserver.observe(root)
    intersectionObserver.observe(root)
    document.addEventListener('visibilitychange', sync)
    root.addEventListener('pointerdown', onDown)
    root.addEventListener('pointermove', onMove)
    root.addEventListener('pointerup', onUp)
    root.addEventListener('pointercancel', onUp)
    root.addEventListener('pointerleave', onLeave)

    return () => {
      gsap.ticker.remove(tick)
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      document.removeEventListener('visibilitychange', sync)
      root.removeEventListener('pointerdown', onDown)
      root.removeEventListener('pointermove', onMove)
      root.removeEventListener('pointerup', onUp)
      root.removeEventListener('pointercancel', onUp)
      root.removeEventListener('pointerleave', onLeave)
    }
  }, [tags])

  return (
    <div ref={rootRef} className="sphere" data-cursor="drag" data-cursor-text={dragLabel} aria-hidden="true">
      <div className="sphere__glow" />
      <div className="sphere__ring" />
      {tags.map((tag) => (
        <span className="sphere__tag" key={tag} data-tag={tag}>
          {tag}
        </span>
      ))}
    </div>
  )
}
