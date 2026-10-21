import { useId, type JSX } from 'react'
import type { CoverPattern, Project } from '../data/content'

const W = 640
const H = 440

type Palette = Project['palette']

interface PatternProps {
  palette: Palette
  id: string
}

function Waves({ palette }: PatternProps) {
  const lines = Array.from({ length: 10 }, (_, i) => {
    const baseY = 90 + i * 30
    const amp = 16 + i * 3.2
    const phase = i * 0.55
    let d = ''
    for (let x = -20; x <= W + 20; x += 16) {
      const y = baseY + Math.sin(x / 92 + phase) * amp + Math.sin(x / 41 + phase * 1.7) * 5
      d += `${x === -20 ? 'M' : 'L'}${x} ${y.toFixed(1)}`
    }
    return d
  })
  return (
    <g fill="none" strokeLinecap="round">
      {lines.map((d, i) => (
        <path key={i} d={d} stroke={palette[2]} strokeWidth={1.4 + i * 0.18} opacity={0.18 + i * 0.075} />
      ))}
      <circle cx="470" cy="128" r="46" fill={palette[2]} opacity="0.92" />
      <circle cx="470" cy="128" r="74" fill="none" stroke={palette[2]} strokeOpacity="0.35" />
    </g>
  )
}

function Grid({ palette }: PatternProps) {
  const cols = 6
  const rows = 4
  const size = 78
  const gap = 16
  const offsetX = (W - (cols * size + (cols - 1) * gap)) / 2
  const offsetY = (H - (rows * size + (rows - 1) * gap)) / 2
  return (
    <g>
      {Array.from({ length: cols * rows }, (_, i) => {
        const x = offsetX + (i % cols) * (size + gap)
        const y = offsetY + Math.floor(i / cols) * (size + gap)
        const kind = (i * 7 + 3) % 6
        return (
          <g key={i} transform={`translate(${x} ${y})`}>
            <rect
              width={size}
              height={size}
              rx="16"
              fill={kind === 0 ? palette[2] : 'rgba(255,255,255,0.08)'}
              stroke="rgba(255,255,255,0.28)"
            />
            {kind === 1 && <circle cx={size / 2} cy={size / 2} r="14" fill={palette[2]} />}
            {kind === 2 && (
              <>
                <rect x="14" y="22" width="50" height="7" rx="3.5" fill={palette[2]} opacity="0.9" />
                <rect x="14" y="38" width="34" height="7" rx="3.5" fill="rgba(255,255,255,0.55)" />
                <rect x="14" y="54" width="42" height="7" rx="3.5" fill="rgba(255,255,255,0.35)" />
              </>
            )}
            {kind === 3 && (
              <>
                <rect x="14" y="30" width="50" height="18" rx="9" fill="rgba(255,255,255,0.3)" />
                <circle cx="54" cy="39" r="7" fill={palette[2]} />
              </>
            )}
            {kind === 4 && <path d="M20 44 34 58 60 26" fill="none" stroke={palette[2]} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />}
          </g>
        )
      })}
    </g>
  )
}

function Orbit({ palette, id }: PatternProps) {
  const rings = [
    { rx: 110, ry: 40, planet: 0.15 },
    { rx: 180, ry: 66, planet: 0.62 },
    { rx: 250, ry: 92, planet: 0.35 },
    { rx: 320, ry: 118, planet: 0.85 },
  ]
  return (
    <g transform={`translate(${W / 2} ${H / 2}) rotate(-16)`}>
      {rings.map((ring, i) => {
        const angle = ring.planet * Math.PI * 2
        return (
          <g key={i}>
            <ellipse rx={ring.rx} ry={ring.ry} fill="none" stroke={palette[2]} strokeOpacity={0.5 - i * 0.08} strokeDasharray={i % 2 ? '4 8' : undefined} />
            <circle cx={Math.cos(angle) * ring.rx} cy={Math.sin(angle) * ring.ry} r={10 - i * 1.5} fill={palette[2]} />
          </g>
        )
      })}
      <circle r="58" fill={palette[2]} opacity="0.95" />
      <circle r="58" fill={`url(#shade-${id})`} />
    </g>
  )
}

function Bars({ palette }: PatternProps) {
  const count = 16
  const barWidth = 24
  const gap = (W - 80 - count * barWidth) / (count - 1)
  const heights = Array.from({ length: count }, (_, i) => 70 + Math.abs(Math.sin(i * 1.27 + 0.4)) * 170 + (i % 3) * 18)
  const points = heights.map((h, i) => `${40 + i * (barWidth + gap) + barWidth / 2},${(H - 60 - h - 26).toFixed(1)}`)
  return (
    <g>
      {[0.25, 0.5, 0.75].map((t) => (
        <line key={t} x1="40" x2={W - 40} y1={60 + (H - 120) * t} y2={60 + (H - 120) * t} stroke="rgba(255,255,255,0.12)" strokeDasharray="3 6" />
      ))}
      {heights.map((h, i) => (
        <rect
          key={i}
          x={40 + i * (barWidth + gap)}
          y={H - 60 - h}
          width={barWidth}
          height={h}
          rx="6"
          fill={i === 11 ? palette[0] : palette[1]}
          opacity={i === 11 ? 1 : 0.55 + (i % 4) * 0.1}
        />
      ))}
      <polyline points={points.join(' ')} fill="none" stroke={palette[0]} strokeWidth="3" strokeLinejoin="round" />
      {points.map((point, i) => {
        const [x, y] = point.split(',')
        return <circle key={i} cx={x} cy={y} r={i === 11 ? 7 : 3.5} fill={palette[0]} />
      })}
    </g>
  )
}

const PATTERNS: Record<CoverPattern, (props: PatternProps) => JSX.Element> = {
  waves: Waves,
  grid: Grid,
  orbit: Orbit,
  bars: Bars,
}

/** Procedural cover art so the template looks finished before real screenshots are added. */
export function ProjectCover({ project }: { project: Project }) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  if (project.cover) return <img className="cover" src={project.cover} alt="" loading="lazy" decoding="async" />

  const Pattern = PATTERNS[project.pattern]
  const [from, to] = project.palette
  const isLedger = project.pattern === 'bars'
  return (
    <svg className="cover" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id={`bg-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={isLedger ? '#101014' : from} />
          <stop offset="1" stopColor={isLedger ? '#1d1f16' : to} />
        </linearGradient>
        <radialGradient id={`shade-${id}`} cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="1" stopColor="#000" stopOpacity="0.35" />
        </radialGradient>
        <radialGradient id={`glow-${id}`} cx="0.8" cy="0.1" r="0.9">
          <stop offset="0" stopColor="#fff" stopOpacity="0.28" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width={W} height={H} fill={`url(#bg-${id})`} />
      <rect width={W} height={H} fill={`url(#glow-${id})`} />
      <Pattern palette={project.palette} id={id} />
    </svg>
  )
}
