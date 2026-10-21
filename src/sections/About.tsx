import { useRef, type PointerEvent } from 'react'
import { useApp } from '../context/app-context'
import { SectionHeading } from '../components/SectionHeading'
import { useReveal } from '../hooks/useReveal'
import { gsap, SplitText, useGSAP } from '../lib/gsap'
import { hasFinePointer, isCJK, prefersReducedMotion } from '../lib/motion'
import './About.css'

export function About() {
  const { content } = useApp()
  const { about, profile } = content
  const root = useRef<HTMLElement>(null)
  useReveal(root)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const paragraph = root.current!.querySelector<HTMLElement>('.about__paragraph')!
      const cjk = isCJK(about.paragraph)
      const split = SplitText.create(paragraph, { type: cjk ? 'chars' : 'words', aria: 'none' })
      gsap.fromTo(
        cjk ? split.chars : split.words,
        { opacity: 0.14 },
        {
          opacity: 1,
          stagger: 0.1,
          ease: 'none',
          scrollTrigger: { trigger: paragraph, start: 'top 80%', end: 'bottom 45%', scrub: true },
        },
      )

      gsap.utils.toArray<HTMLElement>('.stat__number').forEach((el) => {
        const target = Number(el.dataset.value)
        const counter = { value: 0 }
        gsap.to(counter, {
          value: target,
          duration: 2.2,
          ease: 'power3.out',
          onUpdate: () => {
            el.textContent = String(Math.round(counter.value))
          },
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        })
      })

      gsap.fromTo(
        '.portrait',
        { clipPath: 'inset(100% 0% 0% 0% round 28px)' },
        {
          clipPath: 'inset(0% 0% 0% 0% round 28px)',
          duration: 1.6,
          ease: 'expo.inOut',
          scrollTrigger: { trigger: '.portrait', start: 'top 85%', once: true },
        },
      )
      gsap.from('.portrait__media', {
        scale: 1.35,
        duration: 2,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.portrait', start: 'top 85%', once: true },
      })
      gsap.to('.portrait__media', {
        yPercent: -8,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true },
      })
    },
    { scope: root },
  )

  const onTilt = (event: PointerEvent<HTMLDivElement>) => {
    if (!hasFinePointer() || prefersReducedMotion()) return
    const rect = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width - 0.5
    const y = (event.clientY - rect.top) / rect.height - 0.5
    gsap.to(event.currentTarget, { rotateY: x * 10, rotateX: -y * 10, duration: 0.8, ease: 'power3.out' })
    event.currentTarget.style.setProperty('--shine-x', `${(x + 0.5) * 100}%`)
    event.currentTarget.style.setProperty('--shine-y', `${(y + 0.5) * 100}%`)
  }
  const onTiltEnd = (event: PointerEvent<HTMLDivElement>) => {
    gsap.to(event.currentTarget, { rotateY: 0, rotateX: 0, duration: 1.2, ease: 'elastic.out(1, 0.5)' })
  }

  return (
    <section id="about" className="section about" ref={root}>
      <div className="container about__grid">
        <div className="about__aside">
          <div className="portrait-wrap">
            <div className="portrait" onPointerMove={onTilt} onPointerLeave={onTiltEnd}>
              <div className="portrait__media">
                {profile.avatar ? (
                  <img src={profile.avatar} alt={profile.name} />
                ) : (
                  <div className="portrait__art">
                    <span className="portrait__initials">{profile.initials}</span>
                  </div>
                )}
              </div>
              <div className="portrait__shine" />
              <div className="portrait__badge">
                <span className="status-dot" />
                {profile.status}
              </div>
            </div>
          </div>
          <dl className="about__facts" data-reveal>
            {about.facts.map((fact) => (
              <div className="fact" key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="about__main">
          <SectionHeading index="01" label={about.label} title={about.title} />
          <div className="about__text">
            <p className="sr-only">{about.paragraph}</p>
            <p className="about__paragraph" aria-hidden="true">
              {about.paragraph}
            </p>
          </div>
          <ul className="about__stats" data-reveal>
            {about.stats.map((stat) => (
              <li className="stat" key={stat.label}>
                <span className="stat__value">
                  <span className="stat__number" data-value={stat.value}>
                    {stat.value}
                  </span>
                  <span className="stat__suffix">{stat.suffix}</span>
                </span>
                <span className="stat__label">{stat.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
