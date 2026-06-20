import { useRef, useEffect, Suspense, useState, useCallback } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { dishes } from '../../data/menuData'

// =============================================================================
//  DishModel — carga modelos .glb reales desde /public/modelos3D/
//
//  Estrategia de carga adaptativa por tier de dispositivo:
//   • El componente recibe `maxModelSizeMB` desde ARViewer (via useARSupport).
//   • Si el GLB supera ese límite, se usa PrimitiveFallback automáticamente.
//   • Hay un timeout de 18 s: si el GLB no terminó de cargar, se cae al fallback.
//   • El error WebGL context lost se captura y propaga para que ARViewer muestre
//     un mensaje amigable al usuario.
//
//  Tamaños de referencia de los modelos actuales (para orientación):
//   burguer.glb        51 KB   ← único preload seguro
//   BigMac.glb          2 MB
//   cookie.glb          2 MB
//   muffin.glb          4 MB
//   pizza.glb           4 MB
//   crispykitchen.glb   6 MB
//   grilled-cheese.glb  6 MB
//   fries*.glb          8 MB
//   polloentero.glb     8 MB
//   PepperoniPizza.glb  8 MB
//   BurgerKFC.glb      12 MB
//   Cheeseburger.glb   11 MB
//   Croissant.glb      11 MB
//   Sandwich.glb       14 MB
//   noodle.glb         22 MB   ← NUNCA en mid/low
//   spaghetti.glb      30 MB   ← NUNCA en mid/low
//   MasaMadre.glb      36 MB   ← NUNCA en mid/low
// =============================================================================

// Tamaños aproximados en MB de cada archivo (se usan para el filtro de tier).
// Mantener actualizado si se agregan/comprimen modelos.
const MODEL_SIZE_MB = {
  '/modelos3D/burguer.glb':           0.05,
  '/modelos3D/BigMac.glb':            2.0,
  '/modelos3D/cookie.glb':            2.0,
  '/modelos3D/pan-flauta.glb':        1.7,
  '/modelos3D/tablita-sushi.glb':     1.0,
  '/modelos3D/crassant.glb':          2.9,
  '/modelos3D/muffin.glb':            3.9,
  '/modelos3D/pizza.glb':             4.4,
  '/modelos3D/burguer-completa.glb':  4.2,
  '/modelos3D/pizza-salame.glb':      5.1,
  '/modelos3D/grilled-cheese.glb':    6.3,
  '/modelos3D/hotcake.glb':           6.6,
  '/modelos3D/crispykitchen.glb':     6.8,
  '/modelos3D/pan-masamadre.glb':     7.1,
  '/modelos3D/fries.glb':             8.4,
  '/modelos3D/fries1.glb':            8.4,
  '/modelos3D/fries2.glb':            8.4,
  '/modelos3D/polloentero.glb':       8.5,
  '/modelos3D/PepperoniPizza.glb':    8.7,
  '/modelos3D/Cheeseburger.glb':     11.9,
  '/modelos3D/BurgerKFC.glb':        12.8,
  '/modelos3D/salchicha-envuelta.glb':12.7,
  '/modelos3D/Sandwich.glb':         14.4,
  '/modelos3D/alita-pollo.glb':      14.6,
  '/modelos3D/carne-cruda-waggui.glb':16.1,
  '/modelos3D/medialuna.glb':        17.2,
  '/modelos3D/sushi-ramen.glb':       20.1,
}

// ---- Detectar si es un path a .glb ------------------------------------------
function isGlbPath(model) {
  return typeof model === 'string' && model.endsWith('.glb')
}

// ---- Decidir si el GLB puede cargarse en este dispositivo -------------------
function canLoadGlb(path, maxModelSizeMB) {
  const sizeMB = MODEL_SIZE_MB[path]
  if (sizeMB === undefined) return true // desconocido → intentar siempre
  return sizeMB <= maxModelSizeMB
}

// =============================================================================
//  GlbModel — carga real del GLB con centrado/escala automáticos
// =============================================================================
const GLB_LOAD_TIMEOUT_MS = 18_000

function GlbModel({ path, accent, onLoadError }) {
  const groupRef  = useRef()
  const timedOut  = useRef(false)

  // El Suspense padre captura la promesa de useGLTF
  const { scene } = useGLTF(path)

  useEffect(() => {
    // Timeout de seguridad: si el effect tarda más de lo esperado algo falló
    const timer = setTimeout(() => {
      timedOut.current = true
      onLoadError?.('timeout')
    }, GLB_LOAD_TIMEOUT_MS)

    return () => clearTimeout(timer)
  }, [onLoadError])

  useEffect(() => {
    if (!groupRef.current || timedOut.current) return

    try {
      // Clonar para no mutar el caché de useGLTF
      const cloned = scene.clone(true)

      // Obtener ajustes específicos del plato
      const dishInfo = dishes?.find((d) => d.model === path)
      const scaleAdjust = dishInfo?.scaleAdjust ?? 1.0
      const positionAdjust = dishInfo?.positionAdjust ?? [0, 0, 0]
      const rotationAdjust = dishInfo?.rotationAdjust ?? [0, 0, 0]

      // ── Centrar y escalar automáticamente ──────────────────────────────────
      const box    = new THREE.Box3().setFromObject(cloned)
      const size   = new THREE.Vector3()
      box.getSize(size)
      const maxDim = Math.max(size.x, size.y, size.z)

      // Normalizamos a 1.8 unidades Three.js (la escala AR se aplica en ARScene) multiplicada por el ajuste
      const targetSize = 1.8 * scaleAdjust
      const scale      = maxDim > 0 ? targetSize / maxDim : 1
      cloned.scale.setScalar(scale)

      // Centrar en el origen
      const center = new THREE.Vector3()
      box.getCenter(center)
      cloned.position.sub(center.multiplyScalar(scale))
      
      // Aplicar posición ajustada (base 0.05 + offset Y, más offsets X y Z)
      cloned.position.y += 0.05 + positionAdjust[1]
      cloned.position.x += positionAdjust[0]
      cloned.position.z += positionAdjust[2]

      // Aplicar rotación ajustada
      cloned.rotation.x += rotationAdjust[0]
      cloned.rotation.y += rotationAdjust[1]
      cloned.rotation.z += rotationAdjust[2]

      // Habilitar sombras en todos los meshes
      cloned.traverse((node) => {
        if (node.isMesh) {
          node.castShadow    = true
          node.receiveShadow = true
          // Liberar geometrías del CPU-side una vez subidas a GPU
          if (node.geometry) node.geometry.attributes = { ...node.geometry.attributes }
        }
      })

      // Limpiar hijos previos y agregar el nuevo
      while (groupRef.current.children.length > 0) {
        groupRef.current.remove(groupRef.current.children[0])
      }
      groupRef.current.add(cloned)
    } catch (err) {
      onLoadError?.('parse_error')
    }
  }, [scene, path, onLoadError])

  return <group ref={groupRef} />
}

// =============================================================================
//  Primitivas de respaldo (siempre disponibles, cero costo de red)
// =============================================================================
import * as THREE_PRIM from 'three'
import { useMemo } from 'react'

function useMaterials(accent) {
  return useMemo(() => {
    const ceramic     = new THREE_PRIM.MeshStandardMaterial({ color: '#f4f1ea', roughness: 0.35, metalness: 0.02 })
    const ceramicDark = new THREE_PRIM.MeshStandardMaterial({ color: '#e7e2d8', roughness: 0.45 })
    const food        = new THREE_PRIM.MeshStandardMaterial({ color: accent || '#C2491D', roughness: 0.6, metalness: 0.0 })
    return { ceramic, ceramicDark, food }
  }, [accent])
}

function Plate({ mat }) {
  return (
    <group>
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <cylinderGeometry args={[1, 0.96, 0.05, 48]} />
        <primitive object={mat.ceramic} attach="material" />
      </mesh>
      <mesh receiveShadow position={[0, 0.026, 0]}>
        <cylinderGeometry args={[0.82, 0.82, 0.012, 48]} />
        <primitive object={mat.ceramicDark} attach="material" />
      </mesh>
      <mesh castShadow position={[0, 0.03, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.95, 0.045, 12, 48]} />
        <primitive object={mat.ceramic} attach="material" />
      </mesh>
    </group>
  )
}

function BurgerStack({ accent }) {
  return (
    <group position={[0, 0.05, 0]}>
      <mesh castShadow position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.5, 0.45, 0.12, 32]} />
        <meshStandardMaterial color="#caa05a" roughness={0.6} />
      </mesh>
      <mesh castShadow position={[0, 0.17, 0]}>
        <cylinderGeometry args={[0.52, 0.52, 0.14, 32]} />
        <meshStandardMaterial color={accent} roughness={0.7} />
      </mesh>
      <mesh castShadow position={[0, 0.26, 0]} rotation={[0, Math.PI / 6, 0]}>
        <boxGeometry args={[0.78, 0.03, 0.78]} />
        <meshStandardMaterial color="#e8a93a" roughness={0.4} />
      </mesh>
      <mesh castShadow position={[0, 0.38, 0]}>
        <sphereGeometry args={[0.52, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#d8a85e" roughness={0.55} />
      </mesh>
    </group>
  )
}

function Pizza({ accent }) {
  const toppings = useMemo(
    () =>
      Array.from({ length: 9 }, () => ({
        pos: [(Math.random() - 0.5) * 1.3, 0.09, (Math.random() - 0.5) * 1.3],
        s: 0.06 + Math.random() * 0.05,
      })),
    []
  )
  return (
    <group position={[0, 0.03, 0]}>
      <mesh castShadow position={[0, 0.03, 0]}>
        <cylinderGeometry args={[0.92, 0.92, 0.06, 40]} />
        <meshStandardMaterial color="#e8c98a" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.065, 0]}>
        <cylinderGeometry args={[0.82, 0.82, 0.02, 40]} />
        <meshStandardMaterial color="#d98b4a" roughness={0.5} />
      </mesh>
      {toppings.map((t, i) => (
        <mesh key={i} position={t.pos} castShadow>
          <sphereGeometry args={[t.s, 10, 8]} />
          <meshStandardMaterial color={accent} roughness={0.6} />
        </mesh>
      ))}
    </group>
  )
}

function PastaMound({ accent }) {
  const noodles = useMemo(() => {
    const arr = []
    for (let i = 0; i < 14; i++) {
      arr.push({
        pos: [(Math.random() - 0.5) * 0.7, 0.08 + Math.random() * 0.12, (Math.random() - 0.5) * 0.7],
        rot: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
        r: 0.16 + Math.random() * 0.12,
      })
    }
    return arr
  }, [])
  return (
    <group position={[0, 0.04, 0]}>
      <mesh position={[0, 0.03, 0]} castShadow>
        <sphereGeometry args={[0.5, 24, 16]} />
        <meshStandardMaterial color={accent} roughness={0.5} />
      </mesh>
      {noodles.map((n, i) => (
        <mesh key={i} position={n.pos} rotation={n.rot} castShadow>
          <torusGeometry args={[n.r, 0.035, 8, 20]} />
          <meshStandardMaterial color="#e8c87a" roughness={0.55} />
        </mesh>
      ))}
    </group>
  )
}

function SteakCut({ accent }) {
  return (
    <group position={[0, 0.06, 0]}>
      <mesh castShadow rotation={[0, 0.3, 0]}>
        <boxGeometry args={[0.85, 0.16, 0.55]} />
        <meshStandardMaterial color={accent} roughness={0.65} />
      </mesh>
      {[-0.25, 0, 0.25].map((x, i) => (
        <mesh key={i} position={[x, 0.085, 0]} rotation={[0, 0.3, 0]}>
          <boxGeometry args={[0.04, 0.01, 0.5]} />
          <meshStandardMaterial color="#3a1c0e" roughness={0.8} />
        </mesh>
      ))}
      <mesh position={[0.5, 0, -0.2]} castShadow>
        <sphereGeometry args={[0.12, 12, 8]} />
        <meshStandardMaterial color="#caa83f" roughness={0.6} />
      </mesh>
    </group>
  )
}

function FishFillet({ accent }) {
  return (
    <group position={[0, 0.05, 0]}>
      <mesh castShadow rotation={[0, 0.4, 0]}>
        <boxGeometry args={[0.8, 0.12, 0.4]} />
        <meshStandardMaterial color={accent} roughness={0.5} />
      </mesh>
      {[-0.2, 0, 0.2].map((z, i) => (
        <mesh key={i} position={[0.1, 0.02, z]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.6, 8]} />
          <meshStandardMaterial color="#5f7d3a" roughness={0.6} />
        </mesh>
      ))}
    </group>
  )
}

function Bowl({ mat }) {
  const points = useMemo(() => {
    const pts = []
    for (let i = 0; i <= 10; i++) {
      const t = i / 10
      const r = 0.35 + t * 0.6
      const y = t * t * 0.5
      pts.push(new THREE_PRIM.Vector2(r, y))
    }
    return pts
  }, [])
  return (
    <mesh castShadow receiveShadow>
      <latheGeometry args={[points, 48]} />
      <meshStandardMaterial color="#efe9dd" roughness={0.4} side={THREE_PRIM.DoubleSide} />
    </mesh>
  )
}

function DessertSlice({ accent }) {
  return (
    <group position={[0, 0.05, 0]}>
      <mesh castShadow position={[0, 0.14, 0]}>
        <cylinderGeometry args={[0.45, 0.45, 0.28, 36, 1, false, 0, Math.PI * 0.8]} />
        <meshStandardMaterial color="#f3e6c8" roughness={0.5} />
      </mesh>
      <mesh castShadow position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.46, 0.46, 0.06, 36, 1, false, 0, Math.PI * 0.8]} />
        <meshStandardMaterial color="#a9763f" roughness={0.7} />
      </mesh>
      <mesh position={[0.05, 0.29, 0.05]} castShadow>
        <sphereGeometry args={[0.1, 12, 8]} />
        <meshStandardMaterial color={accent} roughness={0.4} />
      </mesh>
    </group>
  )
}

function StarterBites({ accent }) {
  const bites = [[-0.35, 0, 0.1], [0.3, 0, -0.15], [0.05, 0, 0.3]]
  return (
    <group position={[0, 0.05, 0]}>
      {bites.map((p, i) => (
        <group key={i} position={p} rotation={[0, i * 1.2, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.42, 0.08, 0.22]} />
            <meshStandardMaterial color="#d2a861" roughness={0.7} />
          </mesh>
          <mesh position={[0, 0.07, 0]} castShadow>
            <sphereGeometry args={[0.1, 12, 8]} />
            <meshStandardMaterial color={accent} roughness={0.55} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function Glass({ accent, stem }) {
  const points = useMemo(() => {
    const pts = []
    if (stem) {
      pts.push(new THREE_PRIM.Vector2(0.25, 0))
      pts.push(new THREE_PRIM.Vector2(0.25, 0.02))
      pts.push(new THREE_PRIM.Vector2(0.04, 0.06))
      pts.push(new THREE_PRIM.Vector2(0.04, 0.45))
      pts.push(new THREE_PRIM.Vector2(0.32, 0.55))
      pts.push(new THREE_PRIM.Vector2(0.42, 0.95))
      pts.push(new THREE_PRIM.Vector2(0.4,  0.96))
      pts.push(new THREE_PRIM.Vector2(0.3,  0.56))
      pts.push(new THREE_PRIM.Vector2(0.02, 0.46))
    } else {
      pts.push(new THREE_PRIM.Vector2(0.34, 0))
      pts.push(new THREE_PRIM.Vector2(0.34, 0.9))
      pts.push(new THREE_PRIM.Vector2(0.31, 0.9))
      pts.push(new THREE_PRIM.Vector2(0.31, 0.04))
    }
    return pts
  }, [stem])
  return (
    <group>
      <mesh castShadow>
        <latheGeometry args={[points, 40]} />
        <meshStandardMaterial color="#dfe6ea" roughness={0.1} metalness={0.1} transparent opacity={0.32} side={THREE_PRIM.DoubleSide} />
      </mesh>
      <mesh position={[0, stem ? 0.6 : 0.32, 0]}>
        <cylinderGeometry args={stem ? [0.33, 0.06, 0.4, 32] : [0.29, 0.29, 0.6, 32]} />
        <meshStandardMaterial color={accent} roughness={0.2} transparent opacity={0.92} />
      </mesh>
    </group>
  )
}

// ---- Fallback de primitiva por arquetipo ------------------------------------
function PrimitiveFallback({ model, accent }) {
  const mat = useMaterials(accent)
  switch (model) {
    case 'pasta':
      return (<group><Plate mat={mat} /><PastaMound accent={accent} /></group>)
    case 'meat':
      return (<group><Plate mat={mat} /><SteakCut accent={accent} /></group>)
    case 'fish':
      return (<group><Plate mat={mat} /><FishFillet accent={accent} /></group>)
    case 'burger':
      return (<group><Plate mat={mat} /><BurgerStack accent={accent} /></group>)
    case 'pizza':
      return (<group><Pizza accent={accent} /></group>)
    case 'dessert':
      return (<group><Plate mat={mat} /><DessertSlice accent={accent} /></group>)
    case 'salad':
      return (
        <group>
          <Bowl mat={mat} />
          <group position={[0, 0.3, 0]}>
            {Array.from({ length: 8 }).map((_, i) => (
              <mesh key={i} position={[Math.cos(i) * 0.3, Math.random() * 0.15, Math.sin(i) * 0.3]} castShadow>
                <icosahedronGeometry args={[0.14, 0]} />
                <meshStandardMaterial color={i % 2 ? '#6f8b3d' : accent} roughness={0.7} />
              </mesh>
            ))}
          </group>
        </group>
      )
    case 'drink':
      return <Glass accent={accent} stem={false} />
    case 'wine':
      return <Glass accent={accent} stem />
    case 'starter':
    default:
      return (<group><Plate mat={mat} /><StarterBites accent={accent} /></group>)
  }
}

// =============================================================================
//  GlbLoader — wrapper con Suspense + fallback por error/timeout
// =============================================================================
function GlbLoader({ path, accent, modelLight, onLoadError }) {
  return (
    <Suspense fallback={<PrimitiveFallback model={modelLight ?? 'starter'} accent={accent} />}>
      <GlbModel path={path} accent={accent} onLoadError={onLoadError} />
    </Suspense>
  )
}

// =============================================================================
//  Router principal — decide qué renderizar según tier y tamaño del modelo
// =============================================================================
export default function DishModel({
  model      = 'starter',
  accent     = '#C2491D',
  modelLight = 'starter',
  maxModelSizeMB = 20, // viene de useARSupport via ARViewer/ARScene
  onLoadError,
}) {
  const [glbFailed, setGlbFailed] = useState(false)

  const handleLoadError = useCallback((reason) => {
    console.warn('[DishModel] GLB load error:', reason, '→ usando primitiva de respaldo')
    setGlbFailed(true)
    onLoadError?.(reason)
  }, [onLoadError])

  // ── Caso 1: arquetipo legacy (nombre de string simple, sin .glb) ─────────
  if (!isGlbPath(model)) {
    return <PrimitiveFallback model={model} accent={accent} />
  }

  // ── Caso 2: GLB falló previamente (error en carga o timeout) ────────────
  if (glbFailed) {
    return <PrimitiveFallback model={modelLight} accent={accent} />
  }

  // ── Caso 3: GLB demasiado grande para este dispositivo ───────────────────
  if (!canLoadGlb(model, maxModelSizeMB)) {
    console.info(
      `[DishModel] Modelo ${model} supera el límite de ${maxModelSizeMB} MB para este dispositivo.`,
      '→ usando primitiva de respaldo'
    )
    return <PrimitiveFallback model={modelLight} accent={accent} />
  }

  // ── Caso 4: cargar el GLB real ───────────────────────────────────────────
  return (
    <GlbLoader
      path={model}
      accent={accent}
      modelLight={modelLight}
      onLoadError={handleLoadError}
    />
  )
}
