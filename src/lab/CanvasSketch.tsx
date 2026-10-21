import { useRef } from 'react'
import { useSketch, type Sketch } from './useSketch'

/** `create` must be referentially stable (module-level function or memoised). */
export function CanvasSketch({ create }: { create: () => Sketch }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useSketch(ref, create)
  return <canvas ref={ref} className="sketch-canvas" />
}
