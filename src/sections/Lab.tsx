import { useCallback, useRef, type ReactNode } from 'react'
import { SectionHeading } from '../components/SectionHeading'
import { useApp } from '../context/app-context'
import type { LabItem } from '../data/content'
import { useReveal } from '../hooks/useReveal'
import { CanvasSketch } from '../lab/CanvasSketch'
import { FlipGrid } from '../lab/FlipGrid'
import { GooeyTrail } from '../lab/GooeyTrail'
import { LabCard, type LabCursor } from '../lab/LabCard'
import { MorphShapes } from '../lab/MorphShapes'
import { dotGridSketch, flowFieldSketch, particleTextSketch } from '../lab/sketches'
import './Lab.css'

interface Demo {
  node: ReactNode
  cursor?: LabCursor
}

export function Lab() {
  const { content } = useApp()
  const { lab, ui } = content
  const root = useRef<HTMLElement>(null)
  useReveal(root)

  const particles = useCallback(() => particleTextSketch(lab.particleWord), [lab.particleWord])

  const demos: Record<LabItem['id'], Demo> = {
    particles: { node: <CanvasSketch create={particles} />, cursor: { state: 'dot' } },
    flow: { node: <CanvasSketch create={flowFieldSketch} />, cursor: { state: 'dot' } },
    dots: { node: <CanvasSketch create={dotGridSketch} />, cursor: { state: 'dot' } },
    goo: { node: <GooeyTrail />, cursor: { state: 'hide' } },
    morph: { node: <MorphShapes label={ui.next} /> },
    flip: { node: <FlipGrid shuffleLabel={ui.shuffle} layoutLabel={ui.relayout} /> },
  }

  return (
    <section id="lab" className="section lab" ref={root}>
      <div className="container">
        <SectionHeading index="05" label={lab.label} title={lab.title} intro={lab.intro} />
        <div className="lab__grid">
          {lab.items.map((item, index) => (
            <LabCard key={item.id} item={item} index={index} cursor={demos[item.id].cursor}>
              {demos[item.id].node}
            </LabCard>
          ))}
        </div>
      </div>
    </section>
  )
}
