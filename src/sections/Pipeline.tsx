import { useEffect, useRef, useState } from 'react'
import { Check, Copy } from '../components/Icons'
import { SectionHeading } from '../components/SectionHeading'
import { useApp } from '../context/app-context'
import { useReveal } from '../hooks/useReveal'
import { gsap, useGSAP } from '../lib/gsap'
import { pad, prefersReducedMotion } from '../lib/motion'
import './Pipeline.css'

async function copySnippet(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
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

/** 3D 专属轨道：AI + Blender 全流程交付规范与 bpy 脚本展示区 */
export function Pipeline() {
  const { content } = useApp()
  const pipeline = content.pipeline
  const root = useRef<HTMLElement>(null)
  const [copied, setCopied] = useState(false)
  useReveal(root)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      gsap.from('.pipeline-card', {
        y: 44,
        autoAlpha: 0,
        duration: 1.05,
        ease: 'expo.out',
        stagger: 0.08,
        scrollTrigger: { trigger: '.pipeline__steps', start: 'top 84%', once: true },
      })
      gsap.from('.pipeline__panel', {
        y: 36,
        autoAlpha: 0,
        duration: 1.1,
        ease: 'expo.out',
        stagger: 0.1,
        scrollTrigger: { trigger: '.pipeline__bento', start: 'top 84%', once: true },
      })
    },
    { scope: root },
  )

  useEffect(() => {
    if (!copied) return
    const timer = window.setTimeout(() => setCopied(false), 2200)
    return () => window.clearTimeout(timer)
  }, [copied])

  if (!pipeline) return null

  const onCopy = async () => {
    if (await copySnippet(pipeline.script.code)) setCopied(true)
  }

  return (
    <section id="pipeline" className="section pipeline" ref={root}>
      <div className="container">
        <SectionHeading index="05" label={pipeline.label} title={pipeline.title} intro={pipeline.intro} />

        <ol className="pipeline__steps">
          {pipeline.steps.map((item) => (
            <li className="pipeline-card" key={item.step}>
              <div className="pipeline-card__head">
                <span className="pipeline-card__step">{item.step}</span>
                <span className="pipeline-card__tools">{item.tools}</span>
              </div>
              <h3 className="pipeline-card__title">{item.title}</h3>
              <p className="pipeline-card__summary">{item.summary}</p>
              <p className="pipeline-card__deliverable">{item.deliverable}</p>
            </li>
          ))}
        </ol>

        <div className="pipeline__bento">
          <div className="pipeline__panel pipeline__standards">
            <h3 className="pipeline__panel-title">{pipeline.standardsTitle}</h3>
            <ol className="pipeline__checklist">
              {pipeline.standards.map((rule, index) => (
                <li key={rule}>
                  <span>{pad(index + 1)}</span>
                  <p>{rule}</p>
                </li>
              ))}
            </ol>
          </div>

          <div className="pipeline__panel pipeline__script">
            <div className="pipeline__script-head">
              <div>
                <span className="pipeline__filename">{pipeline.script.filename}</span>
                <h3 className="pipeline__panel-title">{pipeline.script.title}</h3>
              </div>
              <button type="button" className="pipeline__copy" onClick={onCopy}>
                {copied ? <Check width={15} height={15} /> : <Copy width={15} height={15} />}
                {copied ? pipeline.copiedCode : pipeline.copyCode}
              </button>
            </div>
            <p className="pipeline__script-desc">{pipeline.script.description}</p>
            <pre className="pipeline__code" tabIndex={0}>
              <code>{pipeline.script.code}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  )
}
