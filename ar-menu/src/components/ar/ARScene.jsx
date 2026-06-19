import { useRef, useState, useEffect } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { OrbitControls, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'
import DishModel from './DishModel'
import Reticle from './Reticle'

// =============================================================================
//  ARScene — renderiza el retículo + el plato en modo AR o el visor 3D
//
//  Mejoras para Android:
//   1. Escala AR adaptativa: calcula AR_BASE_SCALE para que el plato mida
//      siempre ~27 cm reales sobre la mesa, independientemente del tamaño
//      interno del GLB. El resultado se clampea entre 0.05 y 0.35.
//
//   2. Filtro de plano horizontal: analiza la normal de la pose del hit-test.
//      Si el plano detectado está muy inclinado (normal.y < cos(25°) ≈ 0.906),
//      se ignora el resultado. Esto evita que el plato se coloque en el piso
//      cuando la cámara apunta hacia abajo o en paredes.
//
//   3. Estabilización más rápida en Android: STABLE_FRAMES_REQUIRED baja a 12
//      cuando el tier es 'low' o 'mid' para compensar las 30fps típicas.
//
//   4. Sombra simplificada: se usa un plano receptor sin ContactShadows en AR
//      (ContactShadows es costoso e innecesario en inmersivo).
// =============================================================================

// Dimensión real objetivo del plato sobre la mesa (en metros)
const TARGET_PLATE_DIAMETER_M = 0.27  // 27 cm

// Tamaño normalizado que DishModel produce internamente (1.8 unidades Three.js)
const MODEL_NORMALIZED_SIZE = 1.8

// AR_BASE_SCALE por defecto: ajusta 1.8 unidades → 0.27 m
const AR_BASE_SCALE_DEFAULT = TARGET_PLATE_DIAMETER_M / MODEL_NORMALIZED_SIZE  // ≈ 0.15

// Límites de escala AR para evitar platos microscópicos o gigantescos
const AR_SCALE_MIN = 0.05
const AR_SCALE_MAX = 0.35

// Coseno del ángulo máximo de inclinación permitido del plano (25°)
// Si la normal.y del hit-test es menor que este valor, se descarta el resultado.
const MIN_PLANE_NORMAL_Y = Math.cos((25 * Math.PI) / 180)  // ≈ 0.906

// Estabilización: frames consecutivos con retículo estable antes de permitir tap
const STABLE_FRAMES_HIGH = 18   // ~0.3s a 60fps
const STABLE_FRAMES_LOW  = 12   // ~0.4s a 30fps (gama baja)

const STABLE_DISTANCE_THRESHOLD = 0.04  // 4 cm de tolerancia entre frames

export default function ARScene({
  model,
  accent,
  modelLight,
  maxModelSizeMB,
  arActive,
  controlsRef,
  resetSignal,
  onStatus,
  deviceTier,
  onModelLoadError,
}) {
  const { gl } = useThree()
  const reticleRef    = useRef()
  const dishOuterRef  = useRef() // posición + rotación (gesto)
  const dishInnerRef  = useRef() // escala (gesto pinch)
  const placedRef     = useRef(false)
  const [placed, setPlaced]             = useState(false)
  const [reticleStable, setReticleStable] = useState(false)

  const hitTestSourceRef      = useRef(null)
  const hitTestRequestedRef   = useRef(false)
  const lastStatusRef         = useRef('')

  // Estabilización
  const lastReticlePos    = useRef(new THREE.Vector3())
  const stableFrameCount  = useRef(0)
  const stableRef         = useRef(false)

  // Número de frames necesarios según tier del dispositivo
  const stableFramesRequired = (deviceTier === 'low' || deviceTier === 'mid')
    ? STABLE_FRAMES_LOW
    : STABLE_FRAMES_HIGH

  const reportStatus = (s) => {
    if (lastStatusRef.current !== s) {
      lastStatusRef.current = s
      onStatus?.(s)
    }
  }

  // Reset al reiniciar o al entrar/salir de AR
  useEffect(() => {
    placedRef.current = false
    setPlaced(false)
    stableFrameCount.current = 0
    stableRef.current        = false
    setReticleStable(false)
    lastStatusRef.current = ''
    lastReticlePos.current.set(0, 0, 0)
    if (controlsRef?.current) {
      controlsRef.current.rot    = 0
      controlsRef.current.scaleK = 1
    }
    if (dishOuterRef.current) dishOuterRef.current.rotation.set(0, 0, 0)
    if (dishInnerRef.current) dishInnerRef.current.scale.setScalar(1)
  }, [resetSignal, arActive, controlsRef])

  // 'select' (tap en la pantalla durante la sesión) coloca / reubica el plato
  // Solo funciona si el retículo ya está estabilizado sobre un plano horizontal
  useEffect(() => {
    if (!arActive) return
    const session = gl.xr.getSession?.()
    if (!session) return

    const onSelect = () => {
      const reticle = reticleRef.current
      const dish    = dishOuterRef.current
      if (!reticle || !dish || !reticle.visible || !stableRef.current) return
      dish.position.setFromMatrixPosition(reticle.matrix)
      placedRef.current = true
      setPlaced(true)
    }

    session.addEventListener('select', onSelect)
    return () => session.removeEventListener('select', onSelect)
  }, [arActive, gl])

  // Limpiar la fuente de hit-test cuando termina la sesión
  useEffect(() => {
    if (!arActive) {
      hitTestSourceRef.current    = null
      hitTestRequestedRef.current = false
    }
  }, [arActive])

  useFrame((_state, _delta, xrFrame) => {
    // Aplicar gestos al plato colocado
    if (arActive && placedRef.current && controlsRef?.current) {
      const c = controlsRef.current
      if (dishOuterRef.current) dishOuterRef.current.rotation.y = c.rot    ?? 0
      if (dishInnerRef.current) dishInnerRef.current.scale.setScalar(c.scaleK ?? 1)
    }

    if (!arActive || !xrFrame) return

    const session  = gl.xr.getSession?.()
    const refSpace = gl.xr.getReferenceSpace?.()
    if (!session || !refSpace) return

    // Pedir la fuente de hit-test una sola vez por sesión
    if (!hitTestRequestedRef.current) {
      hitTestRequestedRef.current = true
      session
        .requestReferenceSpace('viewer')
        .then((viewerSpace) =>
          session.requestHitTestSource({ space: viewerSpace }).then((source) => {
            hitTestSourceRef.current = source
          })
        )
        .catch(() => {})
    }

    const reticle = reticleRef.current
    const source  = hitTestSourceRef.current

    if (placedRef.current) {
      if (reticle) reticle.visible = false
      reportStatus('placed')
      return
    }

    if (!source || !reticle) {
      reportStatus('searching')
      return
    }

    const results = xrFrame.getHitTestResults(source)
    if (results.length > 0) {
      const pose = results[0].getPose(refSpace)
      if (pose) {
        const mat = pose.transform.matrix

        // ── Filtro de plano horizontal ────────────────────────────────────────
        // La columna 1 de la matriz 4×4 es la normal del plano detectado.
        // En un plano perfectamente horizontal, normal = (0, 1, 0).
        // Si normal.y < MIN_PLANE_NORMAL_Y el plano está muy inclinado → ignorar.
        const normalY = mat[5] // m[1][1] en column-major
        if (normalY < MIN_PLANE_NORMAL_Y) {
          // Superficie demasiado inclinada (pared, suelo oblicuo, etc.)
          reticle.visible = false
          stableFrameCount.current = 0
          if (stableRef.current) {
            stableRef.current = false
            setReticleStable(false)
          }
          reportStatus('searching')
          return
        }
        // ── Fin filtro de orientación ─────────────────────────────────────────

        // Filtro de estabilización
        const currentPos = new THREE.Vector3(mat[12], mat[13], mat[14])
        const dist       = currentPos.distanceTo(lastReticlePos.current)

        if (dist < STABLE_DISTANCE_THRESHOLD) {
          stableFrameCount.current = Math.min(
            stableFrameCount.current + 1,
            stableFramesRequired
          )
        } else {
          stableFrameCount.current = 0
        }
        lastReticlePos.current.copy(currentPos)

        const isStable = stableFrameCount.current >= stableFramesRequired
        if (isStable !== stableRef.current) {
          stableRef.current = isStable
          setReticleStable(isStable)
        }

        reticle.visible = true
        reticle.matrix.fromArray(mat)

        reportStatus(isStable ? 'tapToPlace' : 'stabilizing')
        return
      }
    }

    // No se encontró superficie válida: reiniciar estabilización
    reticle.visible = false
    stableFrameCount.current = 0
    if (stableRef.current) {
      stableRef.current = false
      setReticleStable(false)
    }
    reportStatus('searching')
  })

  // ---------- Visor 3D no inmersivo (hero, desktop, iOS) ----------
  if (!arActive) {
    return (
      <>
        <hemisphereLight args={['#fff7ee', '#cfc6ba', 0.9]} />
        <directionalLight
          position={[3, 5, 2]}
          intensity={1.25}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <directionalLight position={[-3, 2, -2]} intensity={0.4} />
        <group>
          <DishModel
            model={model}
            accent={accent}
            modelLight={modelLight}
            maxModelSizeMB={maxModelSizeMB}
            onLoadError={onModelLoadError}
          />
        </group>
        <ContactShadows
          position={[0, -0.03, 0]}
          opacity={0.45}
          blur={2.6}
          far={2.5}
          scale={5}
          resolution={512}
          color="#1A1714"
        />
        <OrbitControls
          makeDefault
          enablePan={false}
          autoRotate
          autoRotateSpeed={1.0}
          minDistance={1.8}
          maxDistance={4.5}
          minPolarAngle={0.4}
          maxPolarAngle={Math.PI / 2.05}
        />
      </>
    )
  }

  // ---------- AR inmersivo: retículo + plato con sombra ----------
  // La escala AR se fija para que el modelo normalizado (1.8 u) mida ~27 cm.
  const arScale = Math.min(AR_SCALE_MAX, Math.max(AR_SCALE_MIN, AR_BASE_SCALE_DEFAULT))

  return (
    <>
      <hemisphereLight args={['#ffffff', '#cccccc', 1.0]} />
      {/* shadow-mapSize reducido de 1024→512 para Android: menos VRAM */}
      <directionalLight
        position={[1, 3, 1]}
        intensity={1.1}
        castShadow
        shadow-mapSize={[512, 512]}
      />
      <Reticle ref={reticleRef} stable={reticleStable} />
      <group ref={dishOuterRef} visible={placed} scale={arScale}>
        <group ref={dishInnerRef}>
          <DishModel
            model={model}
            accent={accent}
            modelLight={modelLight}
            maxModelSizeMB={maxModelSizeMB}
            onLoadError={onModelLoadError}
          />
        </group>
        {/* Plano receptor de sombra para anclar el plato a la mesa */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
          <planeGeometry args={[8, 8]} />
          <shadowMaterial transparent opacity={0.25} />
        </mesh>
      </group>
    </>
  )
}
