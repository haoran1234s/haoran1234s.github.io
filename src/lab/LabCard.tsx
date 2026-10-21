import type { PointerEvent, ReactNode } from 'react'
import type { LabItem } from '../data/content'
import { pad } from '../lib/motion'

export interface LabCursor {
  state: 'dot' | 'hide' | 'label' | 'drag' | 'view'
  text?: string
}

interface LabCardProps {
  item: LabItem
  index: number
  children: ReactNode
  cursor?: LabCursor
}

export function LabCard({ item, index, children, cursor }: LabCardProps) {
  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty('--mx', `${event.clientX - rect.left}px`)
    event.currentTarget.style.setProperty('--my', `${event.clientY - rect.top}px`)
  }

  return (
    <article
      className="lab-card"
      data-reveal
      data-reveal-delay={(index % 3) * 0.08}
      onPointerMove={onPointerMove}
    >
      <div className="lab-card__stage" data-cursor={cursor?.state} data-cursor-text={cursor?.text}>
        {children}
      </div>
      <div className="lab-card__info">
        <span className="lab-card__index">{pad(index + 1)}</span>
        <div className="lab-card__text">
          <h3 className="lab-card__title">{item.title}</h3>
          <p className="lab-card__tech">{item.tech}</p>
        </div>
        <p className="lab-card__hint">{item.hint}</p>
      </div>
    </article>
  )
}
