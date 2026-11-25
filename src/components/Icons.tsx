import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

const base: IconProps = {
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false,
}

export const ArrowUpRight = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
)

export const ArrowRight = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M4 12h16M14 6l6 6-6 6" />
  </svg>
)

export const ArrowDown = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M12 4v16M6 14l6 6 6-6" />
  </svg>
)

export const ArrowUp = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M12 20V4M6 10l6-6 6 6" />
  </svg>
)

export const Download = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M12 4v11M7 10l5 5 5-5M5 20h14" />
  </svg>
)

export const Copy = (props: IconProps) => (
  <svg {...base} {...props}>
    <rect x="9" y="9" width="11" height="11" rx="2.5" />
    <path d="M5 15V6a2 2 0 0 1 2-2h8" />
  </svg>
)

export const Check = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </svg>
)

export const Close = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
)

export const Sun = (props: IconProps) => (
  <svg {...base} {...props}>
    <circle cx="12" cy="12" r="4.2" />
    <path d="M12 2.5v2M12 19.5v2M4.6 4.6 6 6M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4" />
  </svg>
)

export const Moon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5Z" />
  </svg>
)

export const Shuffle = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5" />
  </svg>
)

export const Refresh = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7" />
  </svg>
)

export const Layout = (props: IconProps) => (
  <svg {...base} {...props}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="2.5" />
    <path d="M3.5 10h17M10 10v10.5" />
  </svg>
)

export const Cube3D = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M12 2.8 20 7.4v9.2L12 21.2 4 16.6V7.4L12 2.8Z" />
    <path d="M4 7.4 12 12l8-4.6M12 12v9.2" />
  </svg>
)
