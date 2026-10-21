import { RevealText } from './RevealText'

interface SectionHeadingProps {
  index: string
  label: string
  title: string
  intro?: string
}

export function SectionHeading({ index, label, title, intro }: SectionHeadingProps) {
  return (
    <div className="section-head">
      <p className="section-label" data-reveal>
        <span className="section-label__index">{index}</span>
        {label}
      </p>
      <RevealText lines={[title]} className="section-title" />
      {intro && (
        <p className="section-intro" data-reveal data-reveal-delay="0.15">
          {intro}
        </p>
      )}
    </div>
  )
}
