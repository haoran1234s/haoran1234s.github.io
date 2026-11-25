import { useEffect, useEffectEvent, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useApp } from '../context/app-context'
import type { Project } from '../data/content'
import { Flip, gsap, useGSAP } from '../lib/gsap'
import { cls } from '../lib/cls'
import { pad, prefersReducedMotion } from '../lib/motion'
import { lockScroll } from '../lib/scroll'
import { ArrowRight, ArrowUpRight, Close } from './Icons'
import { ProjectCover } from './ProjectCover'
import './ProjectModal.css'

export type FlipState = ReturnType<typeof Flip.getState>

interface ProjectModalProps {
  project: Project
  index: number
  total: number
  nextTitle: string
  /** State of the card cover captured right before opening, so the cover can fly into the dialog. */
  flipState: FlipState | null
  getCardMedia: (id: string) => HTMLElement | null
  onNext: () => void
  onClosed: (id: string) => void
}

export function ProjectModal({ project, index, total, nextTitle, flipState, getCardMedia, onNext, onClosed }: ProjectModalProps) {
  const { content } = useApp()
  const { ui } = content
  const root = useRef<HTMLDivElement>(null)
  const closing = useRef(false)
  const shownId = useRef<string | null>(null)
  const currentId = useRef(project.id)
  const titleId = useId()
  const [mediaState, setMediaState] = useState<{ projectId: string; index: number }>({ projectId: project.id, index: 0 })
  const gallery = project.gallery?.length ? project.gallery : null
  const activeMediaIndex = mediaState.projectId === project.id ? mediaState.index : 0
  const activeMedia = gallery?.[activeMediaIndex] ?? null

  useEffect(() => {
    currentId.current = project.id
  }, [project.id])

  // Opening choreography: backdrop, surface, cover (via Flip) and staggered copy.
  const { context } = useGSAP(
    () => {
      const el = root.current!
      const media = el.querySelector<HTMLElement>('.modal__media')!
      el.querySelector<HTMLElement>('.modal__close')?.focus({ preventScroll: true })
      if (prefersReducedMotion()) {
        gsap.from(el, { autoAlpha: 0, duration: 0.25 })
        return
      }
      const tl = gsap.timeline()
      tl.from('.modal__backdrop', { autoAlpha: 0, duration: 0.7, ease: 'power2.out' }, 0)
        .from('.modal__surface', { autoAlpha: 0, y: 80, duration: 1, ease: 'expo.out' }, 0.05)
        .from('.modal__body > *', { y: 48, autoAlpha: 0, duration: 1, ease: 'expo.out', stagger: 0.05 }, 0.3)
        .from('.modal__close', { scale: 0, rotate: -120, duration: 0.9, ease: 'back.out(2)' }, 0.45)
      if (flipState) {
        tl.add(Flip.from(flipState, { targets: media, duration: 1.05, ease: 'expo.inOut', absolute: true, zIndex: 5 }), 0)
      } else {
        tl.from(media, { autoAlpha: 0, scale: 0.92, duration: 0.9, ease: 'expo.out' }, 0.1)
      }
    },
    { scope: root },
  )

  // Hide the originating card cover while its twin lives in the dialog; swap content on "next".
  useGSAP(
    () => {
      const card = getCardMedia(project.id)
      if (card) gsap.set(card, { autoAlpha: 0 })
      const previous = shownId.current
      shownId.current = project.id
      if (previous === null || previous === project.id) return
      root.current!.querySelector('.modal__body')!.scrollTop = 0
      if (prefersReducedMotion()) return
      gsap.from('.modal__media-inner', { clipPath: 'inset(100% 0% 0% 0%)', duration: 1, ease: 'expo.inOut' })
      gsap.from('.modal__body > *', { y: 36, autoAlpha: 0, duration: 0.9, ease: 'expo.out', stagger: 0.04, delay: 0.15 })
    },
    { scope: root, dependencies: [project.id], revertOnUpdate: true },
  )

  const close = () => {
    const el = root.current
    if (!el || closing.current) return
    closing.current = true
    const id = currentId.current
    const done = () => onClosed(id)
    context.add(() => {
      if (prefersReducedMotion()) {
        gsap.to(el, { autoAlpha: 0, duration: 0.2, onComplete: done })
        return
      }
      const media = el.querySelector<HTMLElement>('.modal__media')!
      const card = getCardMedia(id)
      const tl = gsap.timeline({ onComplete: done })
      tl.to('.modal__body > *, .modal__close', { y: 24, autoAlpha: 0, duration: 0.35, ease: 'power2.in', stagger: 0.015 }, 0)
        .to('.modal__surface', { autoAlpha: 0, y: 60, duration: 0.7, ease: 'power3.inOut' }, 0.1)
        .to('.modal__backdrop', { autoAlpha: 0, duration: 0.6, ease: 'power2.inOut' }, 0.4)
      const fit = card ? Flip.fit(media, card, { duration: 0.95, ease: 'expo.inOut', absolute: true, props: 'borderRadius' }) : null
      if (fit instanceof gsap.core.Tween) tl.add(fit, 0.08)
      else tl.to(media, { autoAlpha: 0, scale: 0.9, duration: 0.5, ease: 'power2.in' }, 0.05)
    })
  }

  useEffect(() => {
    lockScroll(true)
    const app = document.getElementById('root')
    app?.setAttribute('inert', '')
    return () => {
      lockScroll(false)
      app?.removeAttribute('inert')
    }
  }, [])

  const onEscape = useEffectEvent(close)
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onEscape()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return createPortal(
    <div className="modal" ref={root} role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <div className="modal__backdrop" onClick={close} />
      <div className="modal__surface" />
      <div className="modal__panel">
        <div className={cls('modal__media', gallery && 'modal__media--studio')} data-flip-id={`cover-${project.id}`}>
          <div className="modal__media-inner" key={`${project.id}-${activeMediaIndex}`}>
            {activeMedia ? (
              <img className="cover cover--studio" src={activeMedia.src} alt={`${project.title} - ${activeMedia.label}`} />
            ) : (
              <ProjectCover project={project} />
            )}
          </div>
          {gallery && gallery.length > 1 && (
            <div className="modal__views" role="tablist" aria-label={project.title}>
              {gallery.map((item, viewIdx) => (
                <button
                  key={item.src}
                  type="button"
                  role="tab"
                  aria-selected={viewIdx === activeMediaIndex}
                  className={cls('modal__view-btn', viewIdx === activeMediaIndex && 'is-active')}
                  onClick={() => setMediaState({ projectId: project.id, index: viewIdx })}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
          <span className="modal__counter">
            {pad(index + 1)} / {pad(total)}
          </span>
        </div>

        <div className="modal__body" data-lenis-prevent>
          <p className="modal__eyebrow">
            <span>{project.year}</span>
            {project.subtitle}
          </p>
          <h2 id={titleId} className="modal__title">
            {project.title}
          </h2>
          <p className="modal__description">{project.description}</p>
          <dl className="modal__facts">
            <div>
              <dt>{ui.projectRole}</dt>
              <dd>{project.role}</dd>
            </div>
            <div>
              <dt>{ui.projectStack}</dt>
              <dd>
                <ul className="chips">
                  {project.stack.map((tech) => (
                    <li className="chip" key={tech}>
                      {tech}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          </dl>
          {project.specs && project.specs.length > 0 && (
            <dl className="modal__specs">
              {project.specs.map((spec) => (
                <div key={spec.label}>
                  <dt>{spec.label}</dt>
                  <dd>{spec.value}</dd>
                </div>
              ))}
            </dl>
          )}
          <div className="modal__highlights">
            <h3>{ui.projectHighlights}</h3>
            <ol>
              {project.highlights.map((highlight, i) => (
                <li key={highlight}>
                  <span>{pad(i + 1)}</span>
                  {highlight}
                </li>
              ))}
            </ol>
          </div>
          {project.links.length > 0 && (
            <div className="modal__links">
              {project.links.map((link) => (
                <a key={link.label} className="modal__link has-roll" href={link.href} target="_blank" rel="noreferrer">
                  <span className="roll">
                    <span>{link.label}</span>
                    <span aria-hidden="true">{link.label}</span>
                  </span>
                  <ArrowUpRight width={16} height={16} />
                </a>
              ))}
            </div>
          )}
          <button type="button" className="modal__next" onClick={onNext} data-cursor="label" data-cursor-text={ui.next}>
            <span className="modal__next-label">{ui.next}</span>
            <span className="modal__next-title">{nextTitle}</span>
            <ArrowRight className="modal__next-icon" width={28} height={28} />
          </button>
        </div>

        <button type="button" className="modal__close" onClick={close} aria-label={ui.close}>
          <Close />
        </button>
      </div>
    </div>,
    document.body,
  )
}
