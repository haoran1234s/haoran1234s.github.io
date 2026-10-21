import { useRef, useState } from 'react'
import { useApp } from '../context/app-context'
import { gsap, useGSAP } from '../lib/gsap'
import { pad, prefersReducedMotion } from '../lib/motion'
import { lockScroll } from '../lib/scroll'
import './Preloader.css'

const GREETINGS = ['你好', 'Hello', 'Bonjour', 'こんにちは', 'Hola', '안녕하세요', 'Ciao', 'Hallo', '你好']

export function Preloader() {
  const { content, markReady } = useApp()
  const [done, setDone] = useState(false)
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    (_context, contextSafe) => {
      const el = root.current
      if (!el || !contextSafe) return
      const count = el.querySelector<HTMLElement>('.preloader__count')!
      const word = el.querySelector<HTMLElement>('.preloader__word')!
      const bar = el.querySelector<HTMLElement>('.preloader__bar i')!
      const reduce = prefersReducedMotion()

      let locked = true
      lockScroll(true)
      const release = () => {
        if (!locked) return
        locked = false
        lockScroll(false)
      }

      const progress = { value: 0 }
      let lastWord = -1
      const counting = gsap.to(progress, {
        value: 100,
        duration: reduce ? 0.4 : 2.2,
        ease: 'power2.inOut',
        onUpdate() {
          count.textContent = pad(Math.round(progress.value), 3)
          bar.style.transform = `scaleX(${progress.value / 100})`
          const index = Math.min(GREETINGS.length - 1, Math.floor((progress.value / 100) * GREETINGS.length))
          if (index !== lastWord) {
            lastWord = index
            word.textContent = GREETINGS[index]
          }
        },
      })

      const exit = contextSafe(() => {
        const tl = gsap.timeline({ onComplete: () => setDone(true) })
        tl.to('.preloader__inner > *', {
          yPercent: -40,
          autoAlpha: 0,
          duration: reduce ? 0.2 : 0.6,
          ease: 'power3.in',
          stagger: 0.05,
        })
          .add(() => {
            release()
            markReady()
          })
          .to('.preloader__panel', {
            yPercent: -100,
            duration: reduce ? 0.3 : 1.1,
            ease: 'expo.inOut',
            stagger: 0.08,
          })
          .to(
            '.preloader__panel',
            { borderBottomLeftRadius: '50% 14vh', borderBottomRightRadius: '50% 14vh', duration: 0.55, ease: 'power2.in' },
            '<',
          )
      })

      const fontsReady = document.fonts?.ready ?? Promise.resolve()
      Promise.all([counting.then(), fontsReady]).then(() => exit())

      return release
    },
    { scope: root },
  )

  if (done) return null

  return (
    <div className="preloader" ref={root} aria-hidden="true">
      <div className="preloader__panel preloader__panel--accent" />
      <div className="preloader__panel">
        <div className="preloader__inner">
          <div className="preloader__top">
            <span>{content.profile.name}</span>
            <span>{content.profile.role}</span>
          </div>
          <p className="preloader__greeting">
            <span className="preloader__word">{GREETINGS[0]}</span>
          </p>
          <div className="preloader__bottom">
            <span className="preloader__count">000</span>
            <span className="preloader__bar">
              <i />
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
