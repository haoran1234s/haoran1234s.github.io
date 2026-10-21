import { useRef } from 'react'
import { useApp } from '../context/app-context'
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap'
import { clamp, prefersReducedMotion } from '../lib/motion'
import './Marquee.css'

function Band({ items, variant, direction }: { items: string[]; variant: 'solid' | 'outline'; direction: 1 | -1 }) {
  const group = (copy: number) => (
    <div className="marquee__group" aria-hidden={copy > 0 ? 'true' : undefined} key={copy}>
      {items.map((item) => (
        <span className="marquee__item" key={item}>
          {item}
          <svg className="marquee__star" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 0c.6 6.6 5.4 11.4 12 12-6.6.6-11.4 5.4-12 12-.6-6.6-5.4-11.4-12-12C6.6 11.4 11.4 6.6 12 0Z" />
          </svg>
        </span>
      ))}
    </div>
  )

  return (
    <div className={`marquee__band marquee__band--${variant}`} data-direction={direction}>
      <div className="marquee__track">{[0, 1, 2].map(group)}</div>
    </div>
  )
}

export function Marquee() {
  const { content } = useApp()
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      // Each track holds three identical groups, so wrapping x within one group width (-33.33%..0) loops seamlessly.
      const wrap = gsap.utils.wrap(-100 / 3, 0)
      const tracks = gsap.utils.toArray<HTMLElement>('.marquee__band').map((band) => ({
        el: band.querySelector<HTMLElement>('.marquee__track')!,
        direction: Number(band.dataset.direction),
        x: Math.random() * -30,
      }))
      const skewTo = gsap.quickTo('.marquee__band', 'skewX', { duration: 0.6, ease: 'power3' })
      const speed = 100 / 3 / 30 // one group width every 30s
      let boost = 1
      let scrollDirection = 1
      let visible = false

      ScrollTrigger.create({
        trigger: root.current,
        start: 'top bottom',
        end: 'bottom top',
        onToggle: (self) => (visible = self.isActive),
        onUpdate: (self) => {
          const velocity = self.getVelocity()
          scrollDirection = self.direction
          boost = Math.max(boost, 1 + clamp(Math.abs(velocity) / 350, 0, 7))
          skewTo(clamp(velocity / -260, -7, 7))
        },
      })

      const tick = (_time: number, deltaMs: number) => {
        boost += (1 - boost) * 0.05
        if (!visible) return
        const dt = Math.min(deltaMs / 1000, 0.1)
        for (const track of tracks) {
          track.x = wrap(track.x + track.direction * scrollDirection * boost * speed * dt)
          track.el.style.transform = `translate3d(${track.x}%, 0, 0)`
        }
      }
      const stop = () => skewTo(0)
      ScrollTrigger.addEventListener('scrollEnd', stop)
      gsap.ticker.add(tick)
      return () => {
        gsap.ticker.remove(tick)
        ScrollTrigger.removeEventListener('scrollEnd', stop)
      }
    },
    { scope: root },
  )

  return (
    <section className="marquee" ref={root} aria-label={content.marquee.top.join(' · ')}>
      <Band items={content.marquee.top} variant="solid" direction={-1} />
      <Band items={content.marquee.bottom} variant="outline" direction={1} />
    </section>
  )
}
