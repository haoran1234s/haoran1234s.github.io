import { useEffect, useRef, useState } from 'react'
import { useApp } from '../context/app-context'
import { ArrowDown, ArrowRight, Download } from '../components/Icons'
import { LocalTime } from '../components/LocalTime'
import { MagneticButton } from '../components/MagneticButton'
import { RoleCycler } from '../components/ScrambleText'
import { SplitChars } from '../components/SplitChars'
import { useInView } from '../hooks/useInView'
import type { BlobPalette, BlobScene } from '../lib/blobScene'
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap'
import { isCJK, onThemeChange, prefersReducedMotion, readCssVar } from '../lib/motion'
import { scrollToTarget } from '../lib/scroll'
import './Hero.css'

const YEAR = new Date().getFullYear()

const readPalette = (): BlobPalette => ({
  a: readCssVar('--blob-a'),
  b: readCssVar('--blob-b'),
  c: readCssVar('--blob-c'),
  dust: readCssVar('--blob-dust'),
  rim: Number(readCssVar('--blob-rim')) || 1,
})

function HeroCanvas({ ready }: { ready: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sceneRef = useRef<BlobScene | null>(null)
  const introPlayed = useRef(false)
  const readyRef = useRef(ready)
  const [status, setStatus] = useState<'loading' | 'ready' | 'failed'>('loading')

  const playIntro = (scene: BlobScene) => {
    if (introPlayed.current) return
    introPlayed.current = true
    if (prefersReducedMotion()) {
      gsap.set(scene.params, { scale: 1, amp: 0.2 })
      return
    }
    gsap.to(scene.params, { scale: 1, duration: 2.4, ease: 'elastic.out(1, 0.55)', delay: 0.2 })
    gsap.to(scene.params, { amp: 0.26, duration: 3, ease: 'power2.out', delay: 0.2 })
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let disposed = false
    let teardown = () => {}

    import('../lib/blobScene')
      .then(({ createBlobScene }) => {
        if (disposed) return
        const scene = createBlobScene(canvas, readPalette(), prefersReducedMotion())
        if (!scene) {
          setStatus('failed')
          return
        }
        sceneRef.current = scene
        setStatus('ready')

        const onPointer = (event: PointerEvent) =>
          scene.setPointer((event.clientX / window.innerWidth) * 2 - 1, -((event.clientY / window.innerHeight) * 2 - 1))
        window.addEventListener('pointermove', onPointer, { passive: true })

        const hero = canvas.closest('section')
        const trigger = ScrollTrigger.create({
          trigger: hero,
          start: 'top top',
          end: 'bottom top',
          onUpdate: (self) => scene.setScroll(self.progress),
        })
        const observer = new IntersectionObserver(([entry]) => scene.setActive(entry.isIntersecting))
        observer.observe(canvas)
        const stopThemeWatch = onThemeChange(() => scene.setPalette(readPalette()))

        if (readyRef.current) playIntro(scene)

        teardown = () => {
          window.removeEventListener('pointermove', onPointer)
          trigger.kill()
          observer.disconnect()
          stopThemeWatch()
          gsap.killTweensOf(scene.params)
          scene.dispose()
          sceneRef.current = null
          introPlayed.current = false
        }
      })
      .catch(() => setStatus('failed'))

    return () => {
      disposed = true
      teardown()
    }
  }, [])

  useEffect(() => {
    readyRef.current = ready
    if (ready && sceneRef.current) playIntro(sceneRef.current)
  }, [ready])

  return (
    <div className="hero__visual" data-status={status} aria-hidden="true">
      <div className="hero__glow" />
      <canvas ref={canvasRef} className="hero__canvas" />
    </div>
  )
}

function HeroContent({ active }: { active: boolean }) {
  const { content, ready } = useApp()
  const { hero, profile, ui } = content
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const tl = gsap.timeline({ paused: true, defaults: { ease: 'expo.out', duration: 1.5 } })
      tl.from('.hero__line .split-char', {
        yPercent: 115,
        rotate: 8,
        transformOrigin: '0% 100%',
        stagger: 0.025,
      })
        .from('.hero__eyebrow', { y: 24, autoAlpha: 0, duration: 1.1 }, 0.25)
        .from('.hero__role', { y: 24, autoAlpha: 0, duration: 1.1 }, 0.55)
        .from('.hero__intro, .hero__cta > *', { y: 32, autoAlpha: 0, stagger: 0.08, duration: 1.2 }, 0.65)
        .from('.hero__meta > *', { y: 18, autoAlpha: 0, stagger: 0.06, duration: 1 }, 0.85)
        .from('.hero__meta', { '--meta-line': 0, duration: 1.6, ease: 'expo.inOut' }, 0.6)
      if (ready) tl.play(0)

      gsap.to('.hero__content', {
        yPercent: -18,
        autoAlpha: 0.15,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
      })
    },
    { scope: root, dependencies: [ready], revertOnUpdate: true },
  )

  const label = hero.titleLines.join(isCJK(hero.titleLines.join('')) ? '' : ' ')

  return (
    <div className="hero__layout container" ref={root}>
      <div className="hero__content">
        <p className="hero__eyebrow">
          <span className="status-dot" />
          {profile.status} · {profile.location}
        </p>

        <h1 className="hero__title" aria-label={label}>
          {hero.titleLines.map((line, index) => (
            <span className="hero__line" key={index} aria-hidden="true">
              <SplitChars text={line} />
            </span>
          ))}
        </h1>

        <p className="hero__role">
          <span className="hero__role-prefix">{hero.rolePrefix}</span>
          <RoleCycler roles={hero.roles} active={ready && active} />
        </p>

        <div className="hero__bottom">
          <p className="hero__intro">{hero.intro}</p>
          <div className="hero__cta">
            <MagneticButton
              href="#projects"
              icon={<ArrowRight />}
              onClick={(event) => {
                event.preventDefault()
                scrollToTarget('#projects')
              }}
            >
              {hero.primaryCta}
            </MagneticButton>
            <MagneticButton variant="ghost" icon={<Download />} onClick={() => window.print()} ariaLabel={ui.downloadResume}>
              {hero.secondaryCta}
            </MagneticButton>
          </div>
        </div>

        <div className="hero__meta">
          <span>
            {profile.location} · <LocalTime timeZone={profile.timezone} />
          </span>
          <a
            href="#about"
            className="hero__scroll"
            onClick={(event) => {
              event.preventDefault()
              scrollToTarget('#about')
            }}
          >
            <span className="hero__scroll-line" />
            {ui.scrollHint}
            <ArrowDown width={14} height={14} />
          </a>
          <span className="hero__meta-right">© {YEAR} Portfolio</span>
        </div>
      </div>
    </div>
  )
}

export function Hero() {
  const { lang, ready } = useApp()
  const root = useRef<HTMLElement>(null)
  const inView = useInView(root)

  return (
    <section id="top" className="hero" ref={root}>
      <HeroCanvas ready={ready} />
      <HeroContent key={lang} active={inView} />
    </section>
  )
}
