import { useRef } from 'react'
import { cls } from '../lib/cls'
import { gsap, useGSAP } from '../lib/gsap'
import { isCJK, prefersReducedMotion } from '../lib/motion'

interface RevealTextProps {
  as?: 'h1' | 'h2' | 'h3'
  lines: string[]
  className?: string
}

/** Heading whose lines slide up from behind a mask when scrolled into view. */
export function RevealText({ as: Tag = 'h2', lines, className }: RevealTextProps) {
  const ref = useRef<HTMLHeadingElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      gsap.from('.line__inner', {
        yPercent: 115,
        rotate: 3,
        transformOrigin: '0% 100%',
        duration: 1.3,
        ease: 'expo.out',
        stagger: 0.09,
        scrollTrigger: { trigger: ref.current, start: 'top 88%', once: true },
      })
    },
    { scope: ref },
  )

  const label = lines.join(isCJK(lines.join('')) ? '' : ' ')

  return (
    <Tag ref={ref} className={cls('reveal-text', className)} aria-label={label}>
      {lines.map((line, index) => (
        <span className="line" key={index} aria-hidden="true">
          <span className="line__inner">{line}</span>
        </span>
      ))}
    </Tag>
  )
}
