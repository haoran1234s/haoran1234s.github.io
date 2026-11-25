import type * as THREE_NS from 'three'

export interface ModelViewerController {
  loadModel: (url: string, onProgress?: (ratio: number | null) => void) => Promise<void>
  setWireframe: (enabled: boolean) => void
  setAutoRotate: (enabled: boolean) => void
  resetCamera: () => void
  dispose: () => void
}

/** 释放材质及其关联贴图资源 */
function disposeMaterial(THREE: typeof THREE_NS, material: THREE_NS.Material) {
  for (const value of Object.values(material)) {
    if (value && typeof value === 'object' && value instanceof THREE.Texture) {
      value.dispose()
    }
  }
  material.dispose()
}

/** 递归释放 3D 对象树上的全部几何体、材质与贴图 */
function disposeObject3D(THREE: typeof THREE_NS, root: THREE_NS.Object3D) {
  root.traverse((node) => {
    if (node instanceof THREE.Mesh) {
      node.geometry?.dispose()
      if (Array.isArray(node.material)) {
        for (const mat of node.material) disposeMaterial(THREE, mat)
      } else if (node.material) {
        disposeMaterial(THREE, node.material)
      }
    }
  })
}

/**
 * 按需动态初始化 Three.js glTF/GLB 交互式检视器：
 * 在异步 import 完成后再创建独立 <canvas>，避免 React StrictMode 下同一画布被初始化两次导致 WebGL 上下文冲突。
 */
export async function createModelViewer(
  container: HTMLElement,
  isCancelled: () => boolean,
  onUserInteract?: () => void,
): Promise<ModelViewerController | null> {
  const [THREE, { GLTFLoader }, { OrbitControls }, { RoomEnvironment }] = await Promise.all([
    import('three'),
    import('three/examples/jsm/loaders/GLTFLoader.js'),
    import('three/examples/jsm/controls/OrbitControls.js'),
    import('three/examples/jsm/environments/RoomEnvironment.js'),
  ])

  if (isCancelled() || !container.isConnected) return null

  const canvas = document.createElement('canvas')
  canvas.className = 'mv-canvas'
  container.replaceChildren(canvas)

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.08
  renderer.outputColorSpace = THREE.SRGBColorSpace

  const scene = new THREE.Scene()
  const pmrem = new THREE.PMREMGenerator(renderer)
  const envTarget = pmrem.fromScene(new RoomEnvironment(), 0.04)
  scene.environment = envTarget.texture

  const camera = new THREE.PerspectiveCamera(40, 1, 0.05, 100)
  const defaultPos = new THREE.Vector3(2.35, 1.35, 2.55)
  camera.position.copy(defaultPos)

  const keyLight = new THREE.DirectionalLight('#fff8ed', 2.2)
  keyLight.position.set(4, 6, 5)
  scene.add(keyLight)

  const rimLight = new THREE.DirectionalLight('#b9d6ff', 1.15)
  rimLight.position.set(-5, 3, -4)
  scene.add(rimLight)

  const fillLight = new THREE.HemisphereLight('#f2f4ff', '#1b1d24', 0.55)
  scene.add(fillLight)

  const controls = new OrbitControls(camera, canvas)
  controls.enableDamping = true
  controls.dampingFactor = 0.06
  controls.enablePan = true
  controls.minDistance = 0.65
  controls.maxDistance = 6.5
  controls.autoRotate = true
  controls.autoRotateSpeed = 1.15

  const handleControlStart = () => {
    if (controls.autoRotate) {
      controls.autoRotate = false
      onUserInteract?.()
    }
  }
  controls.addEventListener('start', handleControlStart)

  let currentGroup: THREE_NS.Group | null = null
  let wireframeEnabled = false
  let loadToken = 0
  let disposed = false
  let rafId = 0

  const syncSize = () => {
    const width = container.clientWidth || window.innerWidth
    const height = container.clientHeight || window.innerHeight
    if (!width || !height) return
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    renderer.setSize(width, height, false)
  }

  syncSize()
  const resizeObserver = new ResizeObserver(syncSize)
  resizeObserver.observe(container)

  const applyWireframe = (root: THREE_NS.Object3D, enabled: boolean) => {
    root.traverse((node) => {
      if (!(node instanceof THREE.Mesh)) return
      const materials = Array.isArray(node.material) ? node.material : [node.material]
      for (const mat of materials) {
        if (mat && 'wireframe' in mat) {
          ;(mat as THREE_NS.MeshStandardMaterial).wireframe = enabled
        }
      }
    })
  }

  const resetCamera = () => {
    camera.position.copy(defaultPos)
    controls.target.set(0, 0, 0)
    controls.update()
  }

  const loadModel = async (url: string, onProgress?: (ratio: number | null) => void) => {
    const token = ++loadToken
    const resolvedUrl = new URL(url, document.baseURI).href
    const loader = new GLTFLoader()
    const gltf = await loader.loadAsync(resolvedUrl, (event) => {
      if (token !== loadToken || disposed) return
      if (event.lengthComputable && event.total > 0) {
        onProgress?.(Math.min(1, event.loaded / event.total))
      } else {
        onProgress?.(null)
      }
    })

    if (token !== loadToken || disposed) {
      disposeObject3D(THREE, gltf.scene)
      return
    }

    if (currentGroup) {
      scene.remove(currentGroup)
      disposeObject3D(THREE, currentGroup)
      currentGroup = null
    }

    const wrapper = new THREE.Group()
    const box = new THREE.Box3().setFromObject(gltf.scene)
    const size = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())
    const maxDim = Math.max(size.x, size.y, size.z) || 1
    const scale = 2.05 / maxDim

    gltf.scene.position.sub(center)
    wrapper.add(gltf.scene)
    wrapper.scale.setScalar(scale)
    applyWireframe(wrapper, wireframeEnabled)

    currentGroup = wrapper
    scene.add(wrapper)
    resetCamera()
  }

  const renderLoop = () => {
    if (disposed) return
    controls.update()
    renderer.render(scene, camera)
    rafId = window.requestAnimationFrame(renderLoop)
  }
  rafId = window.requestAnimationFrame(renderLoop)

  return {
    loadModel,
    setWireframe: (enabled: boolean) => {
      wireframeEnabled = enabled
      if (currentGroup) applyWireframe(currentGroup, enabled)
    },
    setAutoRotate: (enabled: boolean) => {
      controls.autoRotate = enabled
    },
    resetCamera,
    dispose: () => {
      disposed = true
      loadToken++
      window.cancelAnimationFrame(rafId)
      resizeObserver.disconnect()
      controls.removeEventListener('start', handleControlStart)
      controls.dispose()
      if (currentGroup) {
        scene.remove(currentGroup)
        disposeObject3D(THREE, currentGroup)
        currentGroup = null
      }
      envTarget.dispose()
      pmrem.dispose()
      renderer.dispose()
      if (canvas.parentElement === container) {
        canvas.remove()
      }
    },
  }
}
