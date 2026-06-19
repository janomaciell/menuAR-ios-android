import { useEffect, useState } from 'react'

// Detecta capacidades del dispositivo para decidir el camino de AR:
//  - webxr: Android Chrome con ARCore -> experiencia WebAR real (R3F + WebXR)
//  - ios:   iPhone/iPad -> Safari no soporta WebXR -> fallback AR Quick Look
//  - none:  desktop u otros -> visor 3D interactivo
export function useARSupport() {
  const [state, setState] = useState({
    checked: false,
    webxr: false,
    ios: false,
    canShare: false,
  })

  useEffect(() => {
    let cancelled = false

    const ua = navigator.userAgent || ''
    const ios =
      /iPad|iPhone|iPod/.test(ua) ||
      // iPadOS se reporta como Mac con touch
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)

    const canShare = typeof navigator.share === 'function'

    const finish = (webxr) => {
      if (!cancelled) setState({ checked: true, webxr, ios, canShare })
    }

    if (navigator.xr?.isSessionSupported) {
      navigator.xr
        .isSessionSupported('immersive-ar')
        .then((supported) => finish(Boolean(supported)))
        .catch(() => finish(false))
    } else {
      finish(false)
    }

    return () => {
      cancelled = true
    }
  }, [])

  return state
}
