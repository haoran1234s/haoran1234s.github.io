import { useLayoutEffect, useRef } from 'react'
import { useApp } from '../context/app-context'
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap'
import { prefersReducedMotion } from '../lib/motion'
import { scrollToTarget } from '../lib/scroll'
import { ArrowUp } from './Icons'
import { LocalTime } from './LocalTime'
import './Footer.css'

const YEAR = new Date().getFullYear()

export function Footer() {
  const { content } = useApp()
  const { profile, ui } = content
  const root = useRef<HTMLElement>(null)
  const wordmark = useRef<HTMLDivElement>(null)
  const chars = Array.from(profile.wordmark)

  // Fit the wordmark to the container width, whatever name it holds.
  useLayoutEffect(() => {
    const box = wordmark.current
    const text = box?.firstElementChild as HTMLElement | null
    if (!box || !text) return
    let lastWidth = -1
    let disposed = false
    const fit = (force = false) => {
      const width = box.clientWidth
      if (!width || (!force && width === lastWidth)) return
      lastWidth = width
      box.style.setProperty('--wordmark-size', '100px')
      const natural = text.getBoundingClientRect().width
      if (natural > 0) box.style.setProperty('--wordmark-size', `${(width / natural) * 99.5}px`)
    }
    fit()
    const observer = new ResizeObserver(() => fit())
    observer.observe(box)
    document.fonts?.ready.then(() => {
      if (disposed) return
      fit(true)
      ScrollTrigger.refresh()
    })
    return () => {
      disposed = true
      observer.disconnect()
    }
  }, [profile.wordmark])

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      gsap.from('.footer__char', {
        yPercent: 140,
        ease: 'none',
        stagger: 0.05,
        scrollTrigger: { trigger: '.footer__wordmark', start: 'top bottom', end: 'bottom bottom', scrub: 0.6 },
      })
    },
    { scope: root, dependencies: [profile.wordmark], revertOnUpdate: true },
  )

  const slice = (index: number) => ({
    backgroundSize: `${chars.length * 100}% 100%`,
    backgroundPosition: `${chars.length > 1 ? (index / (chars.length - 1)) * 100 : 0}% 0`,
  })

  return (
    <footer className="footer" ref={root}>
      <div className="container">
        <div className="footer__top">
          <p className="footer__role">{profile.role}</p>
          <p className="footer__time">
            <span className="footer__label">{ui.localTime}</span>
            <LocalTime timeZone={profile.timezone} />
          </p>
          <button type="button" className="footer__back has-roll" onClick={() => scrollToTarget(0)}>
            <span className="roll">
              <span>{ui.backToTop}</span>
              <span aria-hidden="true">{ui.backToTop}</span>
            </span>
            <span className="footer__back-icon" aria-hidden="true">
              <ArrowUp width={18} height={18} />
            </span>
          </button>
        </div>

        <div className="footer__wordmark" ref={wordmark} aria-hidden="true">
          <p className="footer__wordmark-text">
            {chars.map((char, index) => (
              <span className="footer__char" key={index} style={slice(index)}>
                {char}
              </span>
            ))}
          </p>
        </div>

        <div className="footer__bottom">
          <span>
            © {YEAR} {profile.name} · {ui.rights}
          </span>
          <span>{ui.builtWith}</span>
        </div>
      </div>
    </footer>
  )
}
