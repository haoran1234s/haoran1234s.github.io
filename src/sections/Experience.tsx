import { useRef, type PointerEvent } from 'react'
import { useApp } from '../context/app-context'
import { SectionHeading } from '../components/SectionHeading'
import { useReveal } from '../hooks/useReveal'
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap'
import { pad, prefersReducedMotion } from '../lib/motion'
import './Experience.css'

const spotlight = (event: PointerEvent<HTMLElement>) => {
  const rect = event.currentTarget.getBoundingClientRect()
  event.currentTarget.style.setProperty('--mx', `${event.clientX - rect.left}px`)
  event.currentTarget.style.setProperty('--my', `${event.clientY - rect.top}px`)
}

export function Experience({ sectionIndex = '03' }: { sectionIndex?: string }) {
  const { content } = useApp()
  const { experience } = content
  const root = useRef<HTMLElement>(null)
  useReveal(root)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      gsap.fromTo(
        '.timeline__progress',
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: { trigger: '.timeline', start: 'top 60%', end: 'bottom 60%', scrub: 0.4 },
        },
      )
      gsap.utils.toArray<HTMLElement>('.job').forEach((job) => {
        ScrollTrigger.create({ trigger: job, start: 'top 60%', end: 'bottom 60%', toggleClass: 'is-active' })
        gsap.from(job.querySelectorAll('[data-anim]'), {
          y: 40,
          autoAlpha: 0,
          duration: 1.1,
          ease: 'expo.out',
          stagger: 0.08,
          scrollTrigger: { trigger: job, start: 'top 82%', once: true },
        })
      })
    },
    { scope: root },
  )

  return (
    <section id="experience" className="section experience" ref={root}>
      <div className="container">
        <SectionHeading index={sectionIndex} label={experience.label} title={experience.title} />
        <div className="timeline">
          <div className="timeline__rail" aria-hidden="true">
            <div className="timeline__progress" />
          </div>
          <ol className="timeline__list">
            {experience.items.map((job, index) => (
              <li className="job" key={job.company}>
                <span className="job__dot" aria-hidden="true" />
                <div className="job__meta" data-anim>
                  <span className="job__index">{pad(index + 1)}</span>
                  <span className="job__period">{job.period}</span>
                  <span className="job__location">{job.location}</span>
                </div>
                <article className="job__card" onPointerMove={spotlight}>
                  <header data-anim>
                    <h3 className="job__company">{job.company}</h3>
                    <p className="job__role">{job.role}</p>
                  </header>
                  <p className="job__summary" data-anim>
                    {job.summary}
                  </p>
                  <ul className="job__highlights" data-anim>
                    {job.highlights.map((highlight) => (
                      <li key={highlight}>{highlight}</li>
                    ))}
                  </ul>
                  <ul className="chips" data-anim>
                    {job.stack.map((tech) => (
                      <li className="chip" key={tech}>
                        {tech}
                      </li>
                    ))}
                  </ul>
                </article>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
