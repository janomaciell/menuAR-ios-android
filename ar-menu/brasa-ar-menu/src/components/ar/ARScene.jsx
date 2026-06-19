import { useRef, useState, useEffect, useMemo } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { OrbitControls, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'
import DishModel from './DishModel'
import Reticle from './Reticle'

// El modelo está autorado a ~1 unidad de radio de plato.
// En AR lo escalamos a ~0.14 -> plato de ~26 cm sobre la mesa real.
const AR_BASE_SCALE = 0.14

export default function ARScene({
  model,
  accent,
  arActive,
  controlsRef,
  resetSignal,
  onStatus,
}) {
  const { gl } = useThree()
  const reticleRef = useRef()
  const dishOuterRef = useRef() // posición + rotación (gesto)
  const dishInnerRef = useRef() // escala (gesto pinch)
  const placedRef = useRef(false)
  const [placed, setPlaced] = useState(false)

  const hitTestSourceRef = useRef(null)
  const hitTestRequestedRef = useRef(false)
  const lastStatusRef = useRef('')

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
    lastStatusRef.current = ''
    if (controlsRef?.current) {
      controlsRef.current.rot = 0
      controlsRef.current.scaleK = 1
    }
    if (dishOuterRef.current) dishOuterRef.current.rotation.set(0, 0, 0)
    if (dishInnerRef.current) dishInnerRef.current.scale.setScalar(1)
  }, [resetSignal, arActive, controlsRef])

  // 'select' (tap en la pantalla durante la sesión) coloca / reubica el plato
  useEffect(() => {
    if (!arActive) return
    const session = gl.xr.getSession?.()
    if (!session) return

    const onSelect = () => {
      const reticle = reticleRef.current
      const dish = dishOuterRef.current
      if (!reticle || !dish || !reticle.visible) return
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
      hitTestSourceRef.current = null
      hitTestRequestedRef.current = false
    }
  }, [arActive])

  useFrame((_state, _delta, xrFrame) => {
    // Aplicar gestos al plato colocado
    if (arActive && placedRef.current && controlsRef?.current) {
      const c = controlsRef.current
      if (dishOuterRef.current) dishOuterRef.current.rotation.y = c.rot ?? 0
      if (dishInnerRef.current) dishInnerRef.current.scale.setScalar(c.scaleK ?? 1)
    }

    if (!arActive || !xrFrame) return

    const session = gl.xr.getSession?.()
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
    const source = hitTestSourceRef.current

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
        reticle.visible = true
        reticle.matrix.fromArray(pose.transform.matrix)
        reportStatus('tapToPlace')
        return
      }
    }
    reticle.visible = false
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
          <DishModel model={model} accent={accent} />
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
  return (
    <>
      <hemisphereLight args={['#ffffff', '#cccccc', 1.0]} />
      <directionalLight
        position={[1, 3, 1]}
        intensity={1.1}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <Reticle ref={reticleRef} />
      <group ref={dishOuterRef} visible={placed} scale={AR_BASE_SCALE}>
        <group ref={dishInnerRef}>
          <DishModel model={model} accent={accent} />
        </group>
        {/* Plano que solo recibe sombra, para anclar el plato a la mesa */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
          <planeGeometry args={[8, 8]} />
          <shadowMaterial transparent opacity={0.3} />
        </mesh>
      </group>
    </>
  )
}
