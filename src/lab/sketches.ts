import { createNoise3D } from '../lib/noise'
import { clamp } from '../lib/motion'
import type { Sketch, SketchContext } from './useSketch'

const TAU = Math.PI * 2
const FONT_STACK = '"Space Grotesk Variable", "PingFang SC", "Microsoft YaHei", "Noto Sans CJK SC", sans-serif'

/**
 * Text sampled into particles that spring back to their "home" pixel.
 * The pointer pushes them away; a click blows them apart.
 */
export function particleTextSketch(text: string): Sketch {
  // Per particle: x, y, vx, vy, homeX, homeY
  let data = new Float32Array(0)
  let count = 0
  let size = 2
  let fontPending = false
  let needsBuild = false

  const build = (c: SketchContext) => {
    const { width: w, height: h } = c
    const offscreen = document.createElement('canvas')
    offscreen.width = w
    offscreen.height = h
    const octx = offscreen.getContext('2d', { willReadFrequently: true })
    if (!octx) return

    let fontSize = h * 0.6
    octx.font = `700 ${fontSize}px ${FONT_STACK}`
    const measured = octx.measureText(text).width
    if (measured > w * 0.84) fontSize *= (w * 0.84) / measured
    const font = `700 ${fontSize}px ${FONT_STACK}`
    octx.font = font
    octx.textAlign = 'center'
    octx.textBaseline = 'middle'
    octx.fillText(text, w / 2, h / 2 + fontSize * 0.04)

    // The web font may still be loading — rebuild once it arrives so the shape is right.
    if (document.fonts && !document.fonts.check(font, text) && !fontPending) {
      fontPending = true
      document.fonts
        .load(font, text)
        .then(() => (needsBuild = true))
        .catch(() => {})
    }

    const pixels = octx.getImageData(0, 0, w, h).data
    const gap = Math.max(3, Math.round(Math.min(w, h) / 70))
    size = Math.max(1.5, gap * 0.62)
    const homes: number[] = []
    for (let y = Math.floor(gap / 2); y < h; y += gap) {
      for (let x = Math.floor(gap / 2); x < w; x += gap) {
        if (pixels[(y * w + x) * 4 + 3] > 128) homes.push(x, y)
      }
    }

    const previous = data
    const previousCount = count
    count = homes.length / 2
    data = new Float32Array(count * 6)
    for (let i = 0; i < count; i++) {
      const o = i * 6
      const hx = homes[i * 2]
      const hy = homes[i * 2 + 1]
      if (i < previousCount) {
        // Keep existing particles where they are so a rebuild morphs instead of jumping.
        data[o] = previous[o]
        data[o + 1] = previous[o + 1]
        data[o + 2] = previous[o + 2]
        data[o + 3] = previous[o + 3]
      } else if (c.reducedMotion) {
        data[o] = hx
        data[o + 1] = hy
      } else {
        data[o] = Math.random() * w
        data[o + 1] = Math.random() * h
      }
      data[o + 4] = hx
      data[o + 5] = hy
    }
  }

  return {
    resize: build,
    frame(c, dt) {
      if (needsBuild) {
        needsBuild = false
        build(c)
      }
      const { ctx, width: w, height: h, pointer, palette } = c
      const f = dt * 60
      const spring = 0.045 * f
      const friction = Math.pow(0.86, f)
      const radius = Math.min(w, h) * 0.22
      const radius2 = radius * radius

      ctx.clearRect(0, 0, w, h)
      ctx.beginPath()
      const excited = new Path2D()
      for (let i = 0; i < count; i++) {
        const o = i * 6
        let x = data[o]
        let y = data[o + 1]
        let vx = data[o + 2]
        let vy = data[o + 3]
        const hx = data[o + 4]
        const hy = data[o + 5]

        if (f > 0) {
          vx += (hx - x) * spring
          vy += (hy - y) * spring
          if (pointer.inside) {
            const dx = x - pointer.x
            const dy = y - pointer.y
            const d2 = dx * dx + dy * dy
            if (d2 < radius2 && d2 > 0.01) {
              const d = Math.sqrt(d2)
              const force = (1 - d / radius) * 6 * f
              vx += (dx / d) * force
              vy += (dy / d) * force
            }
          }
          vx *= friction
          vy *= friction
          x += vx * f
          y += vy * f
          data[o] = x
          data[o + 1] = y
          data[o + 2] = vx
          data[o + 3] = vy
        }

        const ox = x - hx
        const oy = y - hy
        if (ox * ox + oy * oy > 36) excited.rect(x - size / 2, y - size / 2, size, size)
        else ctx.rect(x - size / 2, y - size / 2, size, size)
      }
      ctx.fillStyle = palette.fg
      ctx.fill()
      ctx.fillStyle = palette.accent
      ctx.fill(excited)
    },
    pointerDown(c) {
      if (c.reducedMotion) return
      const reach = Math.max(c.width, c.height) * 0.9
      for (let i = 0; i < count; i++) {
        const o = i * 6
        const dx = data[o] - c.pointer.x
        const dy = data[o + 1] - c.pointer.y
        const d = Math.hypot(dx, dy) || 1
        const force = Math.max(0, 1 - d / reach) * 26 * (0.6 + Math.random() * 0.8)
        data[o + 2] += (dx / d) * force
        data[o + 3] += (dy / d) * force
      }
    },
  }
}

/** Particles advected through a 3D simplex noise field, leaving fading trails. Press to stir a vortex. */
export function flowFieldSketch(): Sketch {
  const noise = createNoise3D(7)
  let xs = new Float32Array(0)
  let ys = new Float32Array(0)
  let life = new Float32Array(0)
  let n = 0

  const spawn = (i: number, w: number, h: number) => {
    xs[i] = Math.random() * w
    ys[i] = Math.random() * h
    life[i] = 60 + Math.random() * 200
  }

  const step = (c: SketchContext, f: number, time: number) => {
    const { ctx, width: w, height: h, pointer, palette } = c
    ctx.globalCompositeOperation = 'destination-out'
    ctx.fillStyle = `rgba(0, 0, 0, ${Math.min(1, 0.06 * f)})`
    ctx.fillRect(0, 0, w, h)
    ctx.globalCompositeOperation = 'source-over'
    ctx.lineWidth = 1.3
    ctx.lineCap = 'round'

    const colors = [palette.accent, palette.accent2, palette.accent3]
    const speed = 1.6 * f
    for (let batch = 0; batch < 3; batch++) {
      ctx.beginPath()
      for (let i = batch; i < n; i += 3) {
        const x = xs[i]
        const y = ys[i]
        const angle = noise(x * 0.0032, y * 0.0032, time * 0.12) * TAU * 1.5
        let vx = Math.cos(angle) * speed
        let vy = Math.sin(angle) * speed

        if (pointer.inside) {
          const dx = x - pointer.x
          const dy = y - pointer.y
          const d2 = dx * dx + dy * dy
          if (pointer.down && d2 < 160 * 160) {
            const d = Math.sqrt(d2) || 1
            const falloff = 1 - d / 160
            vx += ((-dy / d) * 6 - (dx / d) * 1.2) * falloff * f
            vy += ((dx / d) * 6 - (dy / d) * 1.2) * falloff * f
          } else if (!pointer.down && d2 < 90 * 90) {
            const d = Math.sqrt(d2) || 1
            const falloff = 1 - d / 90
            vx += (dx / d) * 2.4 * falloff * f
            vy += (dy / d) * 2.4 * falloff * f
          }
        }

        const nx = x + vx
        const ny = y + vy
        life[i] -= f
        if (life[i] <= 0 || nx < 0 || nx > w || ny < 0 || ny > h) {
          spawn(i, w, h)
          continue
        }
        ctx.moveTo(x, y)
        ctx.lineTo(nx, ny)
        xs[i] = nx
        ys[i] = ny
      }
      ctx.strokeStyle = colors[batch]
      ctx.stroke()
    }
  }

  return {
    resize(c) {
      n = Math.min(1600, Math.round((c.width * c.height) / 260))
      xs = new Float32Array(n)
      ys = new Float32Array(n)
      life = new Float32Array(n)
      for (let i = 0; i < n; i++) spawn(i, c.width, c.height)
      // With reduced motion the loop rarely runs, so pre-draw some trails for the static frame.
      if (c.reducedMotion) for (let k = 0; k < 30; k++) step(c, 1, k / 60)
    },
    frame(c, dt, time) {
      if (dt > 0) step(c, dt * 60, time)
    },
  }
}

interface Ripple {
  x: number
  y: number
  age: number
}

/** A grid of dots on springs. The pointer bends the grid; clicks (and idle time) send out ripples. */
export function dotGridSketch(): Sketch {
  const RIPPLE_SPEED = 420
  const RIPPLE_WIDTH = 26
  const RIPPLE_LIFE = 1.6
  let homeX = new Float32Array(0)
  let homeY = new Float32Array(0)
  let offX = new Float32Array(0)
  let offY = new Float32Array(0)
  let velX = new Float32Array(0)
  let velY = new Float32Array(0)
  let n = 0
  let spacing = 20
  let idle = 0
  const ripples: Ripple[] = []

  return {
    resize(c) {
      const { width: w, height: h } = c
      spacing = clamp(Math.round(Math.min(w, h) / 13), 16, 28)
      const cols = Math.max(1, Math.floor(w / spacing))
      const rows = Math.max(1, Math.floor(h / spacing))
      const startX = (w - (cols - 1) * spacing) / 2
      const startY = (h - (rows - 1) * spacing) / 2
      n = cols * rows
      homeX = new Float32Array(n)
      homeY = new Float32Array(n)
      offX = new Float32Array(n)
      offY = new Float32Array(n)
      velX = new Float32Array(n)
      velY = new Float32Array(n)
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const i = row * cols + col
          homeX[i] = startX + col * spacing
          homeY[i] = startY + row * spacing
        }
      }
    },
    frame(c, dt) {
      const { ctx, width: w, height: h, pointer, palette } = c
      const f = dt * 60

      if (dt > 0) {
        idle += dt
        if (!pointer.inside && !c.reducedMotion && idle > 2.6) {
          idle = 0
          ripples.push({ x: w * (0.2 + Math.random() * 0.6), y: h * (0.2 + Math.random() * 0.6), age: 0 })
        }
        for (const ripple of ripples) ripple.age += dt
        while (ripples.length && ripples[0].age > RIPPLE_LIFE) ripples.shift()
      }

      const reach = spacing * 4.2
      const friction = Math.pow(0.82, f)
      ctx.clearRect(0, 0, w, h)
      ctx.beginPath()
      const excited = new Path2D()

      for (let i = 0; i < n; i++) {
        const hx = homeX[i]
        const hy = homeY[i]
        if (f > 0) {
          let targetX = 0
          let targetY = 0
          if (pointer.inside) {
            const dx = hx - pointer.x
            const dy = hy - pointer.y
            const d = Math.hypot(dx, dy)
            if (d < reach && d > 0.001) {
              const push = (1 - d / reach) ** 2 * spacing * 1.2
              targetX += (dx / d) * push
              targetY += (dy / d) * push
            }
          }
          for (const ripple of ripples) {
            const dx = hx - ripple.x
            const dy = hy - ripple.y
            const d = Math.hypot(dx, dy) || 1
            const delta = d - ripple.age * RIPPLE_SPEED
            const wave = Math.exp(-(delta * delta) / (2 * RIPPLE_WIDTH * RIPPLE_WIDTH)) * (1 - ripple.age / RIPPLE_LIFE) * 10
            targetX += (dx / d) * wave
            targetY += (dy / d) * wave
          }
          velX[i] = (velX[i] + (targetX - offX[i]) * 0.08 * f) * friction
          velY[i] = (velY[i] + (targetY - offY[i]) * 0.08 * f) * friction
          offX[i] += velX[i] * f
          offY[i] += velY[i] * f
        }

        const offset = Math.hypot(offX[i], offY[i])
        const x = hx + offX[i]
        const y = hy + offY[i]
        const r = 1.6 + Math.min(offset * 0.12, 3)
        const path = offset > 1.5 ? excited : ctx
        path.moveTo(x + r, y)
        path.arc(x, y, r, 0, TAU)
      }
      ctx.fillStyle = palette.faint
      ctx.fill()
      ctx.fillStyle = palette.accent
      ctx.fill(excited)
    },
    pointerDown(c) {
      idle = 0
      ripples.push({ x: c.pointer.x, y: c.pointer.y, age: 0 })
    },
  }
}
