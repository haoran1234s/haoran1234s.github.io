import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import { Layout, Shuffle } from '../components/Icons'
import { useInView } from '../hooks/useInView'
import { Flip, gsap, useGSAP } from '../lib/gsap'
import { pad, prefersReducedMotion } from '../lib/motion'

type FlipLayout = 'grid' | 'feature' | 'bars'

const LAYOUTS: FlipLayout[] = ['grid', 'feature', 'bars']
const TILES = Array.from({ length: 9 }, (_, id) => ({ id, height: 0.28 + ((id * 37) % 72) / 100 }))
const AUTOPLAY_MS = 3200

interface FlipGridProps {
  shuffleLabel: string
  layoutLabel: string
}

/**
 * React only changes the DOM order / layout class; GSAP Flip records the old boxes first
 * and animates every tile from where it was to where it is now.
 */
export function FlipGrid({ shuffleLabel, layoutLabel }: FlipGridProps) {
  const root = useRef<HTMLDivElement>(null)
  const pending = useRef<ReturnType<typeof Flip.getState> | null>(null)
  const hovered = useRef(false)
  const [layout, setLayout] = useState<FlipLayout>('grid')
  const [order, setOrder] = useState(() => TILES.map((tile) => tile.id))
  const [reduced] = useState(prefersReducedMotion)
  const inView = useInView(root)

  const capture = useCallback(() => {
    const tiles = root.current?.querySelectorAll('.flip-tile')
    if (tiles) pending.current = Flip.getState(tiles)
  }, [])

  const shuffle = useCallback(() => {
    capture()
    setOrder((currentOrder) => {
      const next = [...currentOrder]
      while (next.every((id, i) => id === currentOrder[i])) gsap.utils.shuffle(next)
      return next
    })
  }, [capture])

  const relayout = useCallback(() => {
    capture()
    setLayout((current) => LAYOUTS[(LAYOUTS.indexOf(current) + 1) % LAYOUTS.length])
  }, [capture])

  useGSAP(
    () => {
      const state = pending.current
      pending.current = null
      if (!state || reduced) return
      Flip.from(state, { absolute: true, duration: 0.9, ease: 'expo.inOut', stagger: 0.025 })
    },
    { scope: root, dependencies: [layout, order] },
  )

  useEffect(() => {
    if (!inView || reduced) return
    let step = 0
    const timer = window.setInterval(() => {
      if (hovered.current || document.hidden) return
      step += 1
      if (step % 2) shuffle()
      else relayout()
    }, AUTOPLAY_MS)
    return () => window.clearInterval(timer)
  }, [inView, reduced, shuffle, relayout])

  return (
    <div
      ref={root}
      className="flip"
      onPointerEnter={() => (hovered.current = true)}
      onPointerLeave={() => (hovered.current = false)}
    >
      <div className="flip__grid" data-layout={layout}>
        {order.map((id) => (
          <div
            key={id}
            className="flip-tile"
            data-flip-id={`tile-${id}`}
            data-tone={id % 4}
            style={{ '--h': TILES[id].height } as CSSProperties}
          >
            {pad(id + 1)}
          </div>
        ))}
      </div>
      <div className="flip__controls">
        <span className="flip__state" aria-hidden="true">
          layout: <b>{layout}</b>
        </span>
        <button type="button" className="flip__btn" onClick={shuffle} aria-label={shuffleLabel} title={shuffleLabel}>
          <Shuffle />
        </button>
        <button type="button" className="flip__btn" onClick={relayout} aria-label={layoutLabel} title={layoutLabel}>
          <Layout />
        </button>
      </div>
    </div>
  )
}
