import { useCallback, useRef, useState, type MouseEvent } from 'react'
import { useApp } from '../context/app-context'
import type { Project } from '../data/content'
import { ArrowUpRight } from '../components/Icons'
import { ProjectCover } from '../components/ProjectCover'
import { ProjectModal, type FlipState } from '../components/ProjectModal'
import { SectionHeading } from '../components/SectionHeading'
import { useReveal } from '../hooks/useReveal'
import { Flip, gsap, useGSAP } from '../lib/gsap'
import { pad } from '../lib/motion'
import './Projects.css'

/** Keep in sync with the media query in Projects.css. */
const HORIZONTAL_QUERY = '(min-width: 900px) and (prefers-reduced-motion: no-preference)'
const STACKED_QUERY = '(max-width: 899px) and (prefers-reduced-motion: no-preference)'

interface OpenState {
  id: string
  flip: FlipState | null
}

export function Projects() {
  const { content } = useApp()
  const { projects, ui } = content
  const items = projects.items
  const root = useRef<HTMLElement>(null)
  const [opened, setOpened] = useState<OpenState | null>(null)
  useReveal(root)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(
        HORIZONTAL_QUERY,
        () => {
          const el = root.current!
          const pin = el.querySelector<HTMLElement>('.projects__pin')!
          const track = el.querySelector<HTMLElement>('.projects__track')!
          const counter = el.querySelector<HTMLElement>('.projects__current')!
          const bar = el.querySelector<HTMLElement>('.projects__bar i')!
          const distance = () => Math.max(0, track.scrollWidth - document.documentElement.clientWidth)

          const scroller = gsap.to(track, {
            x: () => -distance(),
            ease: 'none',
            scrollTrigger: {
              trigger: pin,
              start: 'top top',
              end: () => `+=${distance()}`,
              pin: true,
              scrub: 1,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                bar.style.transform = `scaleX(${self.progress})`
                counter.textContent = pad(Math.min(items.length, Math.floor(self.progress * items.length) + 1))
              },
            },
          })

          gsap.utils.toArray<HTMLElement>('.project-card__parallax', el).forEach((layer) => {
            gsap.fromTo(
              layer,
              { xPercent: -6 },
              {
                xPercent: 6,
                ease: 'none',
                scrollTrigger: {
                  trigger: layer.closest('.project-card'),
                  containerAnimation: scroller,
                  start: 'left right',
                  end: 'right left',
                  scrub: true,
                },
              },
            )
          })

          gsap.from('.project-card', {
            x: 160,
            autoAlpha: 0,
            rotate: 3,
            duration: 1.4,
            ease: 'expo.out',
            stagger: 0.08,
            scrollTrigger: { trigger: pin, start: 'top 75%', once: true },
          })
        },
        root,
      )
      mm.add(
        STACKED_QUERY,
        () => {
          gsap.utils.toArray<HTMLElement>('.project-card', root.current).forEach((card) => {
            gsap.from(card, {
              y: 64,
              autoAlpha: 0,
              duration: 1.2,
              ease: 'expo.out',
              scrollTrigger: { trigger: card, start: 'top 90%', once: true },
            })
          })
        },
        root,
      )
    },
    { scope: root },
  )

  const getCardMedia = useCallback(
    (id: string) => root.current?.querySelector<HTMLElement>(`.project-card [data-flip-id="cover-${id}"]`) ?? null,
    [],
  )

  const open = (project: Project, event: MouseEvent<HTMLButtonElement>) => {
    const media = event.currentTarget.querySelector<HTMLElement>('.project-card__media')
    setOpened({ id: project.id, flip: media ? Flip.getState(media, { props: 'borderRadius' }) : null })
  }

  const onClosed = useCallback((id: string) => {
    setOpened(null)
    root.current?.querySelector<HTMLElement>(`[data-project="${id}"]`)?.focus({ preventScroll: true })
  }, [])

  const openIndex = opened ? items.findIndex((item) => item.id === opened.id) : -1
  const openProject = openIndex >= 0 ? items[openIndex] : null
  const nextProject = openIndex >= 0 ? items[(openIndex + 1) % items.length] : null

  return (
    <section id="projects" className="projects" ref={root}>
      <div className="projects__pin">
        <div className="container projects__head">
          <SectionHeading index="04" label={projects.label} title={projects.title} intro={projects.intro} />
          <div className="projects__progress" aria-hidden="true">
            <span className="projects__count">
              <span className="projects__current">01</span> / {pad(items.length)}
            </span>
            <span className="projects__bar">
              <i />
            </span>
            <span className="projects__caption">{ui.projectsCounter}</span>
          </div>
        </div>

        <ul className="projects__track">
          {items.map((project, index) => (
            <li className="project-card" key={project.id}>
              <button
                type="button"
                className="project-card__open"
                data-project={project.id}
                data-cursor="view"
                data-cursor-text={ui.view}
                aria-haspopup="dialog"
                aria-label={`${ui.viewProject}: ${project.title}`}
                onClick={(event) => open(project, event)}
              >
                <span className="project-card__media" data-flip-id={`cover-${project.id}`}>
                  <span className="project-card__parallax">
                    <ProjectCover project={project} />
                  </span>
                  <span className="project-card__badge">
                    {ui.view}
                    <ArrowUpRight width={14} height={14} />
                  </span>
                </span>
                <span className="project-card__info">
                  <span className="project-card__index">{pad(index + 1)}</span>
                  <span className="project-card__text">
                    <span className="project-card__title">{project.title}</span>
                    <span className="project-card__subtitle">{project.subtitle}</span>
                  </span>
                  <span className="project-card__year">{project.year}</span>
                </span>
              </button>
            </li>
          ))}
          <li className="project-card project-card--more">
            <a className="project-more" href={projects.more.href} target="_blank" rel="noreferrer">
              <span className="project-more__title">{projects.more.title}</span>
              <span className="project-more__text">{projects.more.text}</span>
              <span className="project-more__cta">
                {projects.more.cta}
                <span className="project-more__icon">
                  <ArrowUpRight width={22} height={22} />
                </span>
              </span>
            </a>
          </li>
        </ul>
      </div>

      {opened && openProject && nextProject && (
        <ProjectModal
          project={openProject}
          index={openIndex}
          total={items.length}
          nextTitle={nextProject.title}
          flipState={opened.flip}
          getCardMedia={getCardMedia}
          onNext={() => setOpened({ id: nextProject.id, flip: opened.flip })}
          onClosed={onClosed}
        />
      )}
    </section>
  )
}
