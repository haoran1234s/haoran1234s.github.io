import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  Group,
  IcosahedronGeometry,
  Mesh,
  PerspectiveCamera,
  Points,
  Quaternion,
  Scene,
  ShaderMaterial,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three'
import { mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js'
import { gsap } from './gsap'

/* 3D simplex noise — Ashima Arts / Stefan Gustavson (MIT) */
const SIMPLEX_NOISE = /* glsl */ `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
            i.z + vec4(0.0, i1.z, i2.z, 1.0))
          + i.y + vec4(0.0, i1.y, i2.y, 1.0))
          + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}
`

const BLOB_VERTEX = /* glsl */ `
uniform float uTime;
uniform float uAmp;
uniform float uFreq;
uniform vec3 uPointerDir;
uniform float uPointerStrength;
varying vec3 vNormal;
varying vec3 vViewPos;
varying float vNoise;

${SIMPLEX_NOISE}

float field(vec3 p) {
  float t = uTime;
  float n = snoise(p * uFreq + vec3(t * 0.32, t * 0.21, -t * 0.17));
  n += 0.38 * snoise(p * uFreq * 2.2 + vec3(-t * 0.28, t * 0.36, t * 0.24));
  return n;
}

vec3 displace(vec3 p, out float n) {
  vec3 dir = normalize(p);
  n = field(dir);
  float bulge = pow(max(dot(dir, uPointerDir), 0.0), 6.0) * uPointerStrength;
  return dir * (1.0 + n * uAmp + bulge);
}

void main() {
  vec3 dir = normalize(position);
  vec3 tangent = normalize(abs(dir.y) > 0.99 ? cross(dir, vec3(1.0, 0.0, 0.0)) : cross(dir, vec3(0.0, 1.0, 0.0)));
  vec3 bitangent = normalize(cross(dir, tangent));
  float eps = 0.012;
  float n0;
  float n1;
  float n2;
  vec3 p0 = displace(dir, n0);
  vec3 p1 = displace(dir + tangent * eps, n1);
  vec3 p2 = displace(dir + bitangent * eps, n2);
  vec3 displacedNormal = normalize(cross(p1 - p0, p2 - p0));
  if (dot(displacedNormal, dir) < 0.0) displacedNormal = -displacedNormal;

  vNoise = n0;
  vNormal = normalize(normalMatrix * displacedNormal);
  vec4 mvPosition = modelViewMatrix * vec4(p0, 1.0);
  vViewPos = mvPosition.xyz;
  gl_Position = projectionMatrix * mvPosition;
}
`

const BLOB_FRAGMENT = /* glsl */ `
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uColorC;
uniform float uRim;
varying vec3 vNormal;
varying vec3 vViewPos;
varying float vNoise;

void main() {
  vec3 n = normalize(vNormal);
  vec3 viewDir = normalize(-vViewPos);
  float fresnel = pow(1.0 - max(dot(n, viewDir), 0.0), 2.4);

  float band = smoothstep(-0.2, 1.1, n.y * 0.55 + 0.5 + vNoise * 0.55);
  vec3 base = mix(uColorA, uColorB, band);
  base = mix(base, uColorC, smoothstep(0.35, 1.0, vNoise) * 0.75);

  vec3 lightDir = normalize(vec3(-0.45, 0.85, 0.6));
  float diffuse = max(dot(n, lightDir), 0.0);
  vec3 halfDir = normalize(lightDir + viewDir);
  float specular = pow(max(dot(n, halfDir), 0.0), 56.0);

  vec3 color = base * (0.32 + 0.78 * diffuse);
  color += specular * 0.45;
  color += fresnel * mix(uColorC, vec3(1.0), 0.35) * uRim;

  gl_FragColor = vec4(color, 1.0);
  #include <colorspace_fragment>
}
`

const DUST_VERTEX = /* glsl */ `
uniform float uTime;
uniform float uSize;
uniform float uPixelRatio;
attribute float aScale;
varying float vAlpha;

void main() {
  vec3 p = position;
  p.y += sin(uTime * 0.35 + aScale * 12.0) * 0.12;
  vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  gl_PointSize = uSize * aScale * uPixelRatio / -mvPosition.z;
  vAlpha = 0.2 + aScale * 0.6;
}
`

const DUST_FRAGMENT = /* glsl */ `
uniform vec3 uColor;
uniform float uOpacity;
varying float vAlpha;

void main() {
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  gl_FragColor = vec4(uColor, smoothstep(0.5, 0.0, d) * vAlpha * uOpacity);
  #include <colorspace_fragment>
}
`

export interface BlobPalette {
  a: string
  b: string
  c: string
  dust: string
  rim: number
}

export interface BlobScene {
  /** Intro-able parameters, tween them with GSAP. */
  params: { scale: number; amp: number }
  setPointer(x: number, y: number): void
  setScroll(progress: number): void
  setPalette(palette: BlobPalette): void
  setActive(active: boolean): void
  dispose(): void
}

export function createBlobScene(canvas: HTMLCanvasElement, palette: BlobPalette, reducedMotion: boolean): BlobScene | null {
  let renderer: WebGLRenderer
  try {
    renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' })
  } catch {
    return null
  }
  renderer.setClearColor(0x000000, 0)

  const isSmall = window.matchMedia('(max-width: 768px)').matches
  const scene = new Scene()
  const camera = new PerspectiveCamera(35, 1, 0.1, 100)
  camera.position.set(0, 0, 6)

  const group = new Group()
  scene.add(group)

  let geometry: BufferGeometry = new IcosahedronGeometry(1, isSmall ? 28 : 56)
  geometry.deleteAttribute('uv')
  geometry.deleteAttribute('normal')
  geometry = mergeVertices(geometry)

  const uniforms = {
    uTime: { value: 0 },
    uAmp: { value: 0 },
    uFreq: { value: 1.25 },
    uPointerDir: { value: new Vector3(0, 0, 1) },
    uPointerStrength: { value: 0 },
    uColorA: { value: new Color(palette.a) },
    uColorB: { value: new Color(palette.b) },
    uColorC: { value: new Color(palette.c) },
    uRim: { value: palette.rim },
  }
  const material = new ShaderMaterial({ vertexShader: BLOB_VERTEX, fragmentShader: BLOB_FRAGMENT, uniforms })
  const blob = new Mesh(geometry, material)
  group.add(blob)

  const dustCount = isSmall ? 260 : 620
  const positions = new Float32Array(dustCount * 3)
  const scales = new Float32Array(dustCount)
  for (let i = 0; i < dustCount; i++) {
    const radius = 1.8 + Math.random() * 4.2
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(Math.random() * 2 - 1)
    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
    positions[i * 3 + 2] = radius * Math.cos(phi) - 1.2
    scales[i] = Math.random()
  }
  const dustGeometry = new BufferGeometry()
  dustGeometry.setAttribute('position', new BufferAttribute(positions, 3))
  dustGeometry.setAttribute('aScale', new BufferAttribute(scales, 1))
  const dustUniforms = {
    uTime: { value: 0 },
    uSize: { value: 70 },
    uPixelRatio: { value: 1 },
    uColor: { value: new Color(palette.dust) },
    uOpacity: { value: 0 },
  }
  const dustMaterial = new ShaderMaterial({
    vertexShader: DUST_VERTEX,
    fragmentShader: DUST_FRAGMENT,
    uniforms: dustUniforms,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
  })
  const dust = new Points(dustGeometry, dustMaterial)
  scene.add(dust)

  const params = { scale: 0, amp: 0 }
  const pointer = new Vector2()
  const pointerTarget = new Vector2()
  const targetColors = { a: new Color(palette.a), b: new Color(palette.b), c: new Color(palette.c), dust: new Color(palette.dust) }
  let targetRim = palette.rim
  let scroll = 0
  let active = true
  let layout = { x: 0, y: 0, scale: 1 }
  const tmpDir = new Vector3()
  const inverse = new Quaternion()

  const resize = () => {
    const width = canvas.clientWidth
    const height = canvas.clientHeight
    if (!width || !height) return
    const pixelRatio = Math.min(window.devicePixelRatio || 1, isSmall ? 1.5 : 1.75)
    renderer.setPixelRatio(pixelRatio)
    renderer.setSize(width, height, false)
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    dustUniforms.uPixelRatio.value = pixelRatio
    const aspect = width / height
    const halfHeight = Math.tan((camera.fov * Math.PI) / 360) * camera.position.z
    const halfWidth = halfHeight * aspect
    layout =
      aspect > 1.05
        ? { x: Math.min(halfWidth * 0.42, 2.2), y: 0.15, scale: Math.min(1.25, halfHeight * 0.62) }
        : { x: 0, y: halfHeight * 0.32, scale: Math.min(halfWidth * 0.62, 1.05) }
  }
  resize()
  const resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(canvas)

  let time = 0
  const tick = (_time: number, deltaMs: number) => {
    if (!active) return
    const dt = Math.min(deltaMs / 1000, 1 / 20)
    time += reducedMotion ? dt * 0.25 : dt
    const ease = 1 - Math.pow(0.001, dt)

    pointer.lerp(pointerTarget, 1 - Math.pow(0.02, dt))
    uniforms.uTime.value = time
    uniforms.uAmp.value = params.amp * (1 + scroll * 1.6)
    uniforms.uPointerStrength.value = (0.12 + Math.min(pointer.length(), 1) * 0.1) * params.scale

    group.position.set(layout.x - pointer.x * 0.12, layout.y + scroll * 1.8 - pointer.y * 0.08, 0)
    const s = layout.scale * params.scale * (1 + scroll * 0.35)
    group.scale.setScalar(Math.max(s, 0.0001))
    blob.rotation.y += dt * 0.12
    blob.rotation.x = Math.sin(time * 0.2) * 0.25 + pointer.y * 0.35
    blob.rotation.z = pointer.x * -0.2

    tmpDir.set(pointer.x * 1.4, pointer.y * 1.4, 1).normalize()
    inverse.copy(blob.quaternion).invert()
    uniforms.uPointerDir.value.copy(tmpDir.applyQuaternion(inverse))

    dust.rotation.y = time * 0.025 + pointer.x * 0.15
    dust.rotation.x = pointer.y * 0.1
    dustUniforms.uTime.value = time
    dustUniforms.uOpacity.value = params.scale

    uniforms.uColorA.value.lerp(targetColors.a, ease)
    uniforms.uColorB.value.lerp(targetColors.b, ease)
    uniforms.uColorC.value.lerp(targetColors.c, ease)
    dustUniforms.uColor.value.lerp(targetColors.dust, ease)
    uniforms.uRim.value += (targetRim - uniforms.uRim.value) * ease

    renderer.render(scene, camera)
  }
  gsap.ticker.add(tick)

  return {
    params,
    setPointer(x, y) {
      pointerTarget.set(x, y)
    },
    setScroll(progress) {
      scroll = progress
    },
    setPalette(next) {
      targetColors.a.set(next.a)
      targetColors.b.set(next.b)
      targetColors.c.set(next.c)
      targetColors.dust.set(next.dust)
      targetRim = next.rim
    },
    setActive(value) {
      active = value
    },
    dispose() {
      gsap.ticker.remove(tick)
      resizeObserver.disconnect()
      geometry.dispose()
      material.dispose()
      dustGeometry.dispose()
      dustMaterial.dispose()
      renderer.dispose()
    },
  }
}
