import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// WebXR (AR) sólo funciona sobre un contexto seguro (HTTPS o localhost).
// Para probar en un teléfono Android real desde la red local necesitás HTTPS:
//   1) npm i -D @vitejs/plugin-basic-ssl
//   2) descomentá las dos líneas marcadas abajo
//   3) accedé desde el celu a https://TU_IP_LOCAL:5173 y aceptá el certificado
// import basicSsl from '@vitejs/plugin-basic-ssl'

export default defineConfig({
  plugins: [
    react(),
    // basicSsl(),            // <- descomentar para HTTPS en red local
  ],
  build: {
    target: 'es2020',
    rollupOptions: {
      output: {
        // Separamos el 3D del resto para que el bundle inicial sea liviano.
        manualChunks: {
          three: ['three'],
          r3f: ['@react-three/fiber', '@react-three/drei'],
          motion: ['framer-motion'],
        },
      },
    },
  },
})
