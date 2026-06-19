import { forwardRef, useMemo, useRef, useEffect } from 'react'
import * as THREE from 'three'

// Anillo que marca la superficie detectada por el hit-test de WebXR.
// La matriz se actualiza a mano desde ARScene (matrixAutoUpdate = false),
// por eso lo dejamos invisible hasta que haya una superficie real.
// Props:
//   stable (bool) — false = naranja (buscando), true = verde (listo para tocar)
const Reticle = forwardRef(function Reticle({ stable = false }, ref) {
  const matRef = useRef()

  const geometry = useMemo(() => {
    const g = new THREE.RingGeometry(0.06, 0.09, 40)
    g.rotateX(-Math.PI / 2) // acostar el anillo sobre la superficie
    return g
  }, [])

  // Actualizar color según estabilidad sin remontar el material
  useEffect(() => {
    if (matRef.current) {
      matRef.current.color.set(stable ? '#22c55e' : '#f97316')
    }
  }, [stable])

  return (
    <mesh ref={ref} geometry={geometry} matrixAutoUpdate={false} visible={false}>
      <meshBasicMaterial
        ref={matRef}
        color={stable ? '#22c55e' : '#f97316'}
        toneMapped={false}
        transparent
        opacity={0.92}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
})

export default Reticle
