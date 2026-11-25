import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useApp } from '../context/app-context'
import { createModelViewer, type ModelViewerController } from '../lib/modelViewer'
import { cls } from '../lib/cls'
import { pad } from '../lib/motion'
import { lockScroll } from '../lib/scroll'
import { Close, Refresh } from './Icons'
import './ModelViewerModal.css'

/** 独立纯净的 Blender 3D 模型 360° 旋转检视弹框 */
export function ModelViewerModal() {
  const { activeModelId, content, lang, openModelViewer, closeModelViewer } = useApp()
  const models = useMemo(() => content.projects.items.filter((item) => Boolean(item.modelUrl)), [content.projects.items])
  const current = useMemo(
    () => models.find((item) => item.id === activeModelId) ?? models[0] ?? null,
    [models, activeModelId],
  )

  const stageRef = useRef<HTMLDivElement>(null)
  const viewerRef = useRef<ModelViewerController | null>(null)
  const closeBtnRef = useRef<HTMLButtonElement>(null)
  const titleId = useId()

  const [wireframe, setWireframe] = useState(false)
  const [autoRotate, setAutoRotate] = useState(true)
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [viewerReady, setViewerReady] = useState(false)
  const [reloadTick, setReloadTick] = useState(0)

  const isZh = lang === 'zh'

  // 锁定滚动并管理 #root inert，避免与底层 ProjectModal 的 inert 相互覆盖
  useEffect(() => {
    lockScroll(true)
    const app = document.getElementById('root')
    const hadInert = app?.hasAttribute('inert') ?? false
    if (!hadInert) app?.setAttribute('inert', '')
    closeBtnRef.current?.focus({ preventScroll: true })
    return () => {
      lockScroll(false)
      if (!hadInert) app?.removeAttribute('inert')
    }
  }, [])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeModelViewer()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [closeModelViewer])

  // 初始化 Three.js 场景（随弹框生命周期创建与完整释放，兼容 StrictMode）
  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    let cancelled = false
    let instance: ModelViewerController | null = null

    createModelViewer(
      stage,
      () => cancelled,
      () => setAutoRotate(false),
    )
      .then((viewer) => {
        if (!viewer) return
        if (cancelled) {
          viewer.dispose()
          return
        }
        instance = viewer
        viewerRef.current = viewer
        setViewerReady(true)
      })
      .catch((err: unknown) => {
        console.error('[ModelViewer] init failed:', err)
        if (!cancelled) {
          const detail = err instanceof Error ? err.message : ''
          setLoading(false)
          setError(
            isZh
              ? `3D 视口初始化失败${detail ? `（${detail}）` : ''}，请刷新重试。`
              : `Failed to initialize 3D viewport${detail ? ` (${detail})` : ''}.`,
          )
        }
      })

    return () => {
      cancelled = true
      setViewerReady(false)
      viewerRef.current = null
      instance?.dispose()
    }
  }, [isZh])

  // 加载当前选中的 Blender GLB 模型
  useEffect(() => {
    const viewer = viewerRef.current
    if (!viewerReady || !viewer || !current?.modelUrl) return
    let cancelled = false

    setLoading(true)
    setProgress(null)
    setError(null)

    viewer
      .loadModel(current.modelUrl, (ratio) => {
        if (!cancelled) setProgress(ratio)
      })
      .then(() => {
        if (!cancelled) setLoading(false)
      })
      .catch((err: unknown) => {
        console.error('[ModelViewer] loadModel failed:', current.modelUrl, err)
        if (!cancelled) {
          const detail = err instanceof Error ? err.message : ''
          setLoading(false)
          setError(
            isZh
              ? `模型加载失败${detail ? `（${detail}）` : ''}，请点击重试。`
              : `Failed to load 3D model${detail ? ` (${detail})` : ''}.`,
          )
        }
      })

    return () => {
      cancelled = true
    }
  }, [viewerReady, current?.modelUrl, reloadTick, isZh])

  useEffect(() => {
    viewerRef.current?.setWireframe(wireframe)
  }, [wireframe])

  useEffect(() => {
    viewerRef.current?.setAutoRotate(autoRotate)
  }, [autoRotate])

  if (!current) return null

  const progressText = progress !== null ? ` ${Math.round(progress * 100)}%` : ''

  return createPortal(
    <div className="mv-modal" role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <div className="mv-backdrop" onClick={closeModelViewer} />
      <div className="mv-shell">
        <div ref={stageRef} className="mv-stage" />

        <header className="mv-top">
          <div className="mv-meta">
            <span className="mv-badge">BLENDER glTF · 360°</span>
            <h2 id={titleId} className="mv-title">
              {current.title}
            </h2>
            <p className="mv-hint">
              {isZh ? '左键拖拽旋转 · 滚轮缩放细节 · 右键平移视角' : 'Left drag to orbit · Scroll to zoom · Right drag to pan'}
            </p>
          </div>
          <button
            ref={closeBtnRef}
            type="button"
            className="mv-close"
            onClick={closeModelViewer}
            aria-label={content.ui.close}
          >
            <Close />
          </button>
        </header>

        {loading && (
          <div className="mv-overlay" aria-live="polite">
            <span className="mv-spinner" aria-hidden="true" />
            <span>
              {isZh ? '正在加载 Blender 3D 模型' : 'Loading Blender 3D model'}
              {progressText}
            </span>
          </div>
        )}

        {error && !loading && (
          <div className="mv-overlay mv-overlay--error" role="alert">
            <span>{error}</span>
            <button type="button" className="mv-retry" onClick={() => setReloadTick((n) => n + 1)}>
              <Refresh width={15} height={15} />
              {isZh ? '重新加载' : 'Retry'}
            </button>
          </div>
        )}

        <footer className="mv-hud">
          <div className="mv-models" role="tablist" aria-label={isZh ? '切换 3D 模型' : 'Switch 3D model'}>
            {models.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={item.id === current.id}
                className={cls('mv-pill', item.id === current.id && 'is-active')}
                onClick={() => openModelViewer(item.id)}
              >
                <span className="mv-pill__index">{pad(idx + 1)}</span>
                <span className="mv-pill__name">{item.title.split('·')[0].trim()}</span>
              </button>
            ))}
          </div>

          <div className="mv-controls">
            <button
              type="button"
              aria-pressed={wireframe}
              className={cls('mv-tool', wireframe && 'is-active')}
              onClick={() => setWireframe((v) => !v)}
            >
              {wireframe ? (isZh ? '实体材质' : 'Shaded') : isZh ? '线框拓扑' : 'Wireframe'}
            </button>
            <button
              type="button"
              aria-pressed={autoRotate}
              className={cls('mv-tool', autoRotate && 'is-active')}
              onClick={() => setAutoRotate((v) => !v)}
            >
              {isZh ? '自动旋转' : 'Auto-rotate'}
            </button>
            <button type="button" className="mv-tool" onClick={() => viewerRef.current?.resetCamera()}>
              {isZh ? '重置视角' : 'Reset view'}
            </button>
          </div>
        </footer>
      </div>
    </div>,
    document.body,
  )
}
