import { isCJK } from './motion'

const LATIN_GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!?#%*+=/\\_—~'
const CJK_GLYPHS = '动效像素渲染帧组件交互设计代码曲线节奏光影粒子网格缓动时间轴弹簧着色器'

const escapeHtml = (char: string) => (char === '&' ? '&amp;' : char === '<' ? '&lt;' : char === '>' ? '&gt;' : char)

/** Decodes `to` into `el` through a burst of random glyphs. Returns a cancel function. */
export function scrambleTo(el: HTMLElement, to: string, duration = 1) {
  const from = el.textContent ?? ''
  const pool = isCJK(to) ? CJK_GLYPHS : LATIN_GLYPHS
  const length = Math.max(from.length, to.length)
  const queue = Array.from({ length }, (_, i) => {
    const start = Math.random() * 0.45
    return { from: from[i] ?? '', to: to[i] ?? '', start, end: start + 0.2 + Math.random() * 0.35, glyph: '' }
  })
  const startTime = performance.now()
  let frame = 0

  const tick = (now: number) => {
    const progress = (now - startTime) / 1000 / duration
    let html = ''
    for (const item of queue) {
      if (progress >= item.end) {
        html += escapeHtml(item.to)
      } else if (progress >= item.start) {
        if (!item.glyph || Math.random() < 0.3) item.glyph = pool[Math.floor(Math.random() * pool.length)]
        html += `<span class="scramble-glyph">${escapeHtml(item.glyph)}</span>`
      } else {
        html += escapeHtml(item.from)
      }
    }
    el.innerHTML = html
    if (progress < 1) frame = requestAnimationFrame(tick)
    else el.textContent = to
  }
  frame = requestAnimationFrame(tick)
  return () => cancelAnimationFrame(frame)
}
