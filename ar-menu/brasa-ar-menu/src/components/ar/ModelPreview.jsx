import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, ContactShadows } from '@react-three/drei'
import DishModel from './DishModel'

// Visor 3D no inmersivo. WebGL puro: funciona en cualquier navegador (incl. iOS).
// Se usa en el hero como "teaser" del AR y como fallback en desktop.
export default function ModelPreview({
  model = 'meat',
  accent = '#C2491D',
  autoRotate = true,
  className = '',
}) {
  return (
    <Canvas
      className={className}
      shadows
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true, preserveDrawingBuffer: true }}
      camera={{ position: [0, 1.25, 2.8], fov: 38 }}
    >
      <Suspense fallback={null}>
        <hemisphereLight args={['#fff7ee', '#cfc6ba', 0.9]} />
        <directionalLight
          position={[3, 5, 2]}
          intensity={1.25}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <directionalLight position={[-3, 2, -2]} intensity={0.4} />

        <group position={[0, 0, 0]}>
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
      </Suspense>

      <OrbitControls
        makeDefault
        enablePan={false}
        autoRotate={autoRotate}
        autoRotateSpeed={1.1}
        minDistance={1.8}
        maxDistance={4.5}
        minPolarAngle={0.4}
        maxPolarAngle={Math.PI / 2.05}
      />
    </Canvas>
  )
}
