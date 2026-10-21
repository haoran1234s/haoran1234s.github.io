import { useEffect, useRef } from 'react'
import { Cursor } from './components/Cursor'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Preloader } from './components/Preloader'
import { PrintResume } from './components/PrintResume'
import { ScrollProgress } from './components/ScrollProgress'
import { useApp } from './context/app-context'
import { ScrollTrigger } from './lib/gsap'
import { destroySmoothScroll, initSmoothScroll } from './lib/scroll'
import { About } from './sections/About'
import { Contact } from './sections/Contact'
import { Experience } from './sections/Experience'
import { Hero } from './sections/Hero'
import { Lab } from './sections/Lab'
import { Marquee } from './sections/Marquee'
import { Projects } from './sections/Projects'
import { Skills } from './sections/Skills'

export function App() {
  const { lang, ready, content } = useApp()
  const { ui } = content
  const greeted = useRef(false)

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
    initSmoothScroll()
    let disposed = false
    document.fonts?.ready.then(() => {
      if (!disposed) ScrollTrigger.refresh()
    })
    return () => {
      disposed = true
      destroySmoothScroll()
    }
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('is-loading', !ready)
    if (ready) ScrollTrigger.refresh()
  }, [ready])

  useEffect(() => {
    if (greeted.current) return
    greeted.current = true
    console.log(
      `%c${ui.consoleGreeting}`,
      'padding: 6px 10px; border-radius: 6px; background: #c8ff4d; color: #0b0b0e; font-weight: 600',
    )
  }, [ui.consoleGreeting])

  // Sections are keyed by language: SplitText and friends rewrite their DOM, so a fresh mount is
  // the reliable way to re-run them. The hero handles its own text so the WebGL scene survives.
  return (
    <>
      <a className="skip-link" href="#main">
        {ui.skip}
      </a>
      <Preloader />
      <Cursor />
      <ScrollProgress />
      <Header />
      <main id="main" tabIndex={-1}>
        <Hero />
        <Marquee key={`marquee-${lang}`} />
        <About key={`about-${lang}`} />
        <Skills key={`skills-${lang}`} />
        <Experience key={`experience-${lang}`} />
        <Projects key={`projects-${lang}`} />
        <Lab key={`lab-${lang}`} />
        <Contact key={`contact-${lang}`} />
      </main>
      <Footer />
      <PrintResume />
      <div className="grain" aria-hidden="true" />
    </>
  )
}
