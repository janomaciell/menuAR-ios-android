import { forwardRef, useMemo } from 'react'
import * as THREE from 'three'

// Anillo que marca la superficie detectada por el hit-test de WebXR.
// La matriz se actualiza a mano desde ARScene (matrixAutoUpdate = false),
// por eso lo dejamos invisible hasta que haya una superficie real.
const Reticle = forwardRef(function Reticle(_, ref) {
  const geometry = useMemo(() => {
    const g = new THREE.RingGeometry(0.06, 0.075, 36)
    g.rotateX(-Math.PI / 2) // acostar el anillo sobre el piso
    return g
  }, [])

  return (
    <mesh ref={ref} geometry={geometry} matrixAutoUpdate={false} visible={false}>
      <meshBasicMaterial color="#C2491D" toneMapped={false} transparent opacity={0.9} />
    </mesh>
  )
})

export default Reticle
