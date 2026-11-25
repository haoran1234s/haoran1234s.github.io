import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from 'react'
import { useApp } from '../context/app-context'
import { cls } from '../lib/cls'
import { gsap, useGSAP } from '../lib/gsap'
import { pad, prefersReducedMotion } from '../lib/motion'
import { lockScroll, scrollToTarget } from '../lib/scroll'
import { ArrowUpRight, Moon, Sun } from './Icons'
import './Header.css'

export function Header() {
  const { content, theme, toggleTheme, toggleLang, ready } = useApp()
  const { nav, ui, profile } = content
  const [menuOpen, setMenuOpen] = useState(false)
  const [active, setActive] = useState('top')
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    let lastY = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 24)
      if (Math.abs(y - lastY) > 8) {
        setHidden(y > lastY && y > window.innerHeight * 0.6)
        lastY = y
      }
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Highlight the nav item whose section crosses the middle of the viewport.
  useEffect(() => {
    const ids = ['top', ...nav.map((item) => item.id)]
    const sections = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => el !== null)
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id)
      },
      { rootMargin: '-50% 0px -50% 0px' },
    )
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [nav])

  useEffect(() => {
    if (!menuOpen) return
    lockScroll(true)
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setMenuOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      lockScroll(false)
      window.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 961px)')
    const onChange = () => desktop.matches && setMenuOpen(false)
    desktop.addEventListener('change', onChange)
    return () => desktop.removeEventListener('change', onChange)
  }, [])

  useGSAP(
    () => {
      if (!ready || prefersReducedMotion()) return
      gsap.from('.header__logo, .header__nav li, .header__actions > *', {
        yPercent: -160,
        autoAlpha: 0,
        duration: 1.1,
        ease: 'expo.out',
        stagger: 0.05,
        delay: 0.55,
        clearProps: 'all',
      })
    },
    { scope: root, dependencies: [ready] },
  )

  const go = (target: string) => (event: MouseEvent) => {
    event.preventDefault()
    setMenuOpen(false)
    scrollToTarget(target)
  }

  const onThemeClick = (event: MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    toggleTheme({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 })
  }

  return (
    <>
      <header
        ref={root}
        className={cls('header', scrolled && 'is-scrolled', hidden && !menuOpen && 'is-hidden', menuOpen && 'is-menu-open')}
      >
        <a href="#top" className="header__logo has-roll" onClick={go('#top')} aria-label={profile.name}>
          <span className="header__mark">{profile.initials}</span>
          <span className="header__name roll" aria-hidden="true">
            <span>{profile.name}</span>
            <span>{profile.nameAlt}</span>
          </span>
        </a>

        <nav className="header__nav" aria-label="Primary">
          <ul>
            {nav.map((item, index) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={go(`#${item.id}`)}
                  className={cls('header__link has-roll', active === item.id && 'is-active')}
                  aria-current={active === item.id ? 'location' : undefined}
                >
                  <span className="header__link-index">{pad(index + 1)}</span>
                  <span className="roll">
                    <span>{item.label}</span>
                    <span aria-hidden="true">{item.label}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header__actions">
          <button type="button" className="header__pill has-roll" onClick={toggleLang} aria-label={ui.langSwitchLabel}>
            <span className="roll">
              <span>{ui.langSwitch}</span>
              <span aria-hidden="true">{ui.langSwitch}</span>
            </span>
          </button>
          <button
            type="button"
            className="header__icon-btn"
            onClick={onThemeClick}
            aria-label={theme === 'dark' ? ui.themeToLight : ui.themeToDark}
          >
            <span className="header__theme-icon" key={theme}>
              {theme === 'dark' ? <Sun /> : <Moon />}
            </span>
          </button>
          <button
            type="button"
            className="header__menu-btn"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="burger" aria-hidden="true">
              <i />
              <i />
            </span>
            <span className="sr-only">{menuOpen ? ui.close : ui.menu}</span>
          </button>
        </div>
      </header>

      <div id="mobile-menu" className={cls('menu', menuOpen && 'is-open')} inert={!menuOpen}>
        <nav aria-label="Mobile">
          <ul className="menu__list">
            {nav.map((item, index) => (
              <li key={item.id} style={{ '--i': index } as CSSProperties}>
                <a href={`#${item.id}`} className="menu__link" onClick={go(`#${item.id}`)}>
                  <span className="menu__link-inner">
                    <small>{pad(index + 1)}</small>
                    {item.label}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="menu__footer">
          <a href={`mailto:${profile.email}`}>{profile.email}</a>
          {profile.socials.length > 0 && (
            <div className="menu__socials">
              {profile.socials.map((social) => (
                <a key={social.label} href={social.href} target="_blank" rel="noreferrer">
                  {social.label}
                  <ArrowUpRight width={14} height={14} />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
