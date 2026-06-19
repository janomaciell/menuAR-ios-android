import { useRef, useEffect, Suspense } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

// =============================================================================
//  DishModel — carga modelos .glb reales desde /public/modelos3D/
//  Si el path apunta a un GLB, lo carga con useGLTF y lo centra/escala.
//  Si el path es un nombre de arquetipo (legacy), usa primitivas procedurales.
// =============================================================================

// ---- Detectar si es un path a .glb ------------------------------------------
function isGlbPath(model) {
  return typeof model === 'string' && model.endsWith('.glb')
}

// ---- Componente que carga el GLB real ---------------------------------------
function GlbModel({ path, accent }) {
  const groupRef = useRef()
  const { scene } = useGLTF(path)

  useEffect(() => {
    if (!groupRef.current) return

    // Clonar para no mutar el caché de useGLTF
    const cloned = scene.clone(true)

    // Centrar y escalar automáticamente
    const box = new THREE.Box3().setFromObject(cloned)
    const size = new THREE.Vector3()
    box.getSize(size)
    const maxDim = Math.max(size.x, size.y, size.z)
    const targetSize = 1.8 // unidades Three.js
    const scale = maxDim > 0 ? targetSize / maxDim : 1

    cloned.scale.setScalar(scale)

    // Centrar en el origen
    const center = new THREE.Vector3()
    box.getCenter(center)
    cloned.position.sub(center.multiplyScalar(scale))

    // Posicionar ligeramente sobre el plano
    cloned.position.y += 0.05

    // Habilitar sombras en todos los meshes
    cloned.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = true
        node.receiveShadow = true
      }
    })

    // Limpiar hijos previos y agregar el nuevo
    while (groupRef.current.children.length > 0) {
      groupRef.current.remove(groupRef.current.children[0])
    }
    groupRef.current.add(cloned)
  }, [scene])

  return <group ref={groupRef} />
}

// ---- Precargar los modelos más usados (mejora UX) ---------------------------
const GLB_PRELOADS = [
  '/modelos3D/burguer.glb',
  '/modelos3D/BurgerKFC.glb',
  '/modelos3D/PepperoniPizza.glb',
  '/modelos3D/spaghetti.glb',
  '/modelos3D/Sandwich.glb',
  '/modelos3D/crispykitchen.glb',
  '/modelos3D/polloentero.glb',
  '/modelos3D/muffin.glb',
  '/modelos3D/cookie.glb',
  '/modelos3D/Croissant.glb',
]
GLB_PRELOADS.forEach((p) => useGLTF.preload(p))

// =============================================================================
//  Primitivas de respaldo (por si el GLB falla o se usa arquetipo legacy)
// =============================================================================
import * as THREE_PRIM from 'three'
import { useMemo } from 'react'

function useMaterials(accent) {
  return useMemo(() => {
    const ceramic = new THREE_PRIM.MeshStandardMaterial({ color: '#f4f1ea', roughness: 0.35, metalness: 0.02 })
    const ceramicDark = new THREE_PRIM.MeshStandardMaterial({ color: '#e7e2d8', roughness: 0.45 })
    const food = new THREE_PRIM.MeshStandardMaterial({ color: accent || '#C2491D', roughness: 0.6, metalness: 0.0 })
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
      pts.push(new THREE_PRIM.Vector2(0.4, 0.96))
      pts.push(new THREE_PRIM.Vector2(0.3, 0.56))
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

// ---- Router principal -------------------------------------------------------
export default function DishModel({ model = 'starter', accent = '#C2491D' }) {
  if (isGlbPath(model)) {
    return (
      <Suspense fallback={<PrimitiveFallback model="starter" accent={accent} />}>
        <GlbModel path={model} accent={accent} />
      </Suspense>
    )
  }
  // legacy: arquetipo por nombre (compatibilidad hacia atrás)
  return <PrimitiveFallback model={model} accent={accent} />
}
