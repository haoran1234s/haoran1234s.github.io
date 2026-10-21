import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ArrowUpRight, Copy } from '../components/Icons'
import { MagneticButton } from '../components/MagneticButton'
import { RevealText } from '../components/RevealText'
import { useApp } from '../context/app-context'
import { useReveal } from '../hooks/useReveal'
import { cls } from '../lib/cls'
import { gsap, useGSAP } from '../lib/gsap'
import { prefersReducedMotion } from '../lib/motion'
import './Contact.css'

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    // Clipboard API needs a secure context; fall back to the legacy selection trick.
    const area = document.createElement('textarea')
    area.value = text
    area.setAttribute('readonly', '')
    area.style.position = 'fixed'
    area.style.opacity = '0'
    document.body.append(area)
    area.select()
    const ok = document.execCommand('copy')
    area.remove()
    return ok
  }
}

export function Contact() {
  const { content } = useApp()
  const { contact, profile, ui } = content
  const root = useRef<HTMLElement>(null)
  const ringId = `ring-${useId().replace(/[^\w-]/g, '')}`
  const [copied, setCopied] = useState(false)
  useReveal(root)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      gsap.from('.contact__badge', {
        scale: 0.3,
        rotate: -120,
        autoAlpha: 0,
        duration: 1.8,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.contact__head', start: 'top 80%', once: true },
      })
      gsap.fromTo(
        '.contact__glow',
        { yPercent: 25, scale: 0.8 },
        {
          yPercent: -15,
          scale: 1.1,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom bottom', scrub: true },
        },
      )
    },
    { scope: root },
  )

  useEffect(() => {
    if (!copied) return
    const timer = window.setTimeout(() => setCopied(false), 2400)
    return () => window.clearTimeout(timer)
  }, [copied])

  const onCopy = async () => {
    if (await copyText(profile.email)) setCopied(true)
  }

  return (
    <section id="contact" className="section contact" ref={root}>
      <div className="contact__glow" aria-hidden="true" />
      <div className="container">
        <p className="section-label" data-reveal>
          <span className="section-label__index">06</span>
          {contact.label}
        </p>

        <div className="contact__head">
          <RevealText lines={contact.titleLines} className="contact__title" />
          <div className="contact__badge">
            <svg className="contact__ring" viewBox="0 0 200 200" aria-hidden="true">
              <defs>
                <path id={ringId} d="M100,100 m-86,0 a86,86 0 1,1 172,0 a86,86 0 1,1 -172,0" />
              </defs>
              <text>
                <textPath href={`#${ringId}`} textLength="536" lengthAdjust="spacing">
                  {`${profile.status} • ${contact.availability} • `}
                </textPath>
              </text>
            </svg>
            <MagneticButton variant="round" href={`mailto:${profile.email}`} icon={<ArrowUpRight />}>
              {contact.cta}
            </MagneticButton>
          </div>
        </div>

        <p className="contact__intro" data-reveal>
          {contact.intro}
        </p>

        <div className="contact__grid">
          <div className="contact__block" data-reveal>
            <span className="contact__label">{contact.labels.email}</span>
            <a className="contact__value has-roll" href={`mailto:${profile.email}`}>
              <span className="roll">
                <span>{profile.email}</span>
                <span aria-hidden="true">{profile.email}</span>
              </span>
            </a>
            <button type="button" className="contact__copy" onClick={onCopy}>
              <Copy width={15} height={15} />
              {ui.copyEmail}
            </button>
          </div>

          {profile.phone && (
            <div className="contact__block" data-reveal data-reveal-delay="0.06">
              <span className="contact__label">{contact.labels.phone}</span>
              <a className="contact__value" href={`tel:${profile.phone.replace(/\s/g, '')}`}>
                {profile.phone}
              </a>
            </div>
          )}

          <div className="contact__block" data-reveal data-reveal-delay="0.12">
            <span className="contact__label">{contact.labels.social}</span>
            <ul className="contact__socials">
              {profile.socials.map((social) => (
                <li key={social.label}>
                  <a href={social.href} target="_blank" rel="noreferrer" className="contact__social has-roll">
                    <span className="roll">
                      <span>{social.label}</span>
                      <span aria-hidden="true">{social.handle}</span>
                    </span>
                    <ArrowUpRight width={14} height={14} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="contact__block" data-reveal data-reveal-delay="0.18">
            <span className="contact__label">{contact.labels.status}</span>
            <p className="contact__value contact__status">
              <span className="status-dot" />
              {profile.status}
            </p>
            <p className="contact__note">{contact.availability}</p>
          </div>
        </div>
      </div>

      {createPortal(
        <div className={cls('toast', copied && 'is-visible')} role="status">
          {copied ? ui.copied : ''}
        </div>,
        document.body,
      )}
    </section>
  )
}
