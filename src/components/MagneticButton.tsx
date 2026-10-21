import { useRef, type MouseEvent, type ReactNode } from 'react'
import { useMagnetic } from '../hooks/useMagnetic'
import { cls } from '../lib/cls'

interface MagneticButtonProps {
  children: ReactNode
  href?: string
  onClick?: (event: MouseEvent<HTMLElement>) => void
  variant?: 'solid' | 'ghost' | 'round'
  icon?: ReactNode
  external?: boolean
  className?: string
  ariaLabel?: string
}

export function MagneticButton({
  children,
  href,
  onClick,
  variant = 'solid',
  icon,
  external,
  className,
  ariaLabel,
}: MagneticButtonProps) {
  const anchorRef = useRef<HTMLAnchorElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  useMagnetic(href ? anchorRef : buttonRef, variant === 'round' ? 0.45 : 0.3)

  const inner = (
    <span className="btn__inner" data-magnetic-inner>
      <span className="roll">
        <span>{children}</span>
        <span aria-hidden="true">{children}</span>
      </span>
      {icon && <span className="btn__icon">{icon}</span>}
    </span>
  )
  const classes = cls('btn has-roll', `btn--${variant}`, className)

  if (href) {
    return (
      <a
        ref={anchorRef}
        href={href}
        className={classes}
        onClick={onClick}
        aria-label={ariaLabel}
        {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
      >
        {inner}
      </a>
    )
  }
  return (
    <button ref={buttonRef} type="button" className={classes} onClick={onClick} aria-label={ariaLabel}>
      {inner}
    </button>
  )
}
