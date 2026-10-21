import { useEffect, useRef } from 'react'
import { prefersReducedMotion } from '../lib/motion'
import { scrambleTo } from '../lib/scramble'

interface RoleCyclerProps {
  roles: string[]
  active: boolean
  interval?: number
}

/** Cycles through `roles`, decoding each one with a scramble effect. */
export function RoleCycler({ roles, active, interval = 2800 }: RoleCyclerProps) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || !active || prefersReducedMotion()) return
    let index = 0
    let cancel = scrambleTo(el, roles[0], 0.9)
    const timer = window.setInterval(() => {
      index = (index + 1) % roles.length
      cancel()
      cancel = scrambleTo(el, roles[index])
    }, interval)
    return () => {
      window.clearInterval(timer)
      cancel()
    }
  }, [roles, active, interval])

  return (
    <span className="role-cycler">
      <span ref={ref} className="role-cycler__text" aria-hidden="true">
        {roles[0]}
      </span>
      <span className="sr-only">{roles.join(' / ')}</span>
    </span>
  )
}
