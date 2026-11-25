import { useMemo, useRef, useState } from 'react'
import { useApp } from '../context/app-context'
import { SectionHeading } from '../components/SectionHeading'
import { TagSphere } from '../components/TagSphere'
import { useReveal } from '../hooks/useReveal'
import { cls } from '../lib/cls'
import { gsap, useGSAP } from '../lib/gsap'
import { pad, prefersReducedMotion } from '../lib/motion'
import './Skills.css'

export function Skills({ sectionIndex = '02' }: { sectionIndex?: string }) {
  const { content } = useApp()
  const { skills, ui } = content
  const root = useRef<HTMLElement>(null)
  const [hovered, setHovered] = useState<string | null>(null)
  const [pinned, setPinned] = useState<string | null>(null)
  const highlight = hovered ?? pinned
  useReveal(root)

  const tags = useMemo(() => Array.from(new Set(skills.groups.flatMap((group) => group.items))), [skills.groups])

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      gsap.utils.toArray<HTMLElement>('.skill-group').forEach((group) => {
        gsap.from(group.querySelectorAll('.skill-chip'), {
          y: 24,
          autoAlpha: 0,
          duration: 0.9,
          ease: 'expo.out',
          stagger: 0.04,
          scrollTrigger: { trigger: group, start: 'top 88%', once: true },
        })
      })
      gsap.from('.sphere', {
        scale: 0.6,
        autoAlpha: 0,
        rotate: -25,
        duration: 1.8,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.sphere', start: 'top 85%', once: true },
      })
    },
    { scope: root },
  )

  return (
    <section id="skills" className="section skills" ref={root}>
      <div className="container">
        <SectionHeading index={sectionIndex} label={skills.label} title={skills.title} intro={skills.intro} />
        <div className="skills__grid">
          <div className="skills__sphere">
            <TagSphere tags={tags} highlight={highlight} dragLabel={ui.drag} />
          </div>
          <div className="skills__groups">
            {skills.groups.map((group, groupIndex) => (
              <div className="skill-group" key={group.title}>
                <h3 className="skill-group__title" data-reveal>
                  <span>{pad(groupIndex + 1)}</span>
                  {group.title}
                </h3>
                <ul className="skill-group__list">
                  {group.items.map((item) => (
                    <li key={item}>
                      <button
                        type="button"
                        className={cls('skill-chip', highlight === item && 'is-active')}
                        aria-pressed={pinned === item}
                        onPointerEnter={() => setHovered(item)}
                        onPointerLeave={() => setHovered(null)}
                        onFocus={() => setHovered(item)}
                        onBlur={() => setHovered(null)}
                        onClick={() => setPinned((current) => (current === item ? null : item))}
                      >
                        {item}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
