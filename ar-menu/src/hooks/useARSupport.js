import { useEffect, useState } from 'react'

// ─────────────────────────────────────────────────────────────────────────────
//  Detecta capacidades del dispositivo para decidir el camino de AR:
//   • webxr  → Android Chrome con ARCore  → experiencia WebAR real (R3F + WebXR)
//   • ios    → iPhone/iPad               → fallback AR Quick Look (model-viewer)
//   • none   → desktop u otros           → visor 3D interactivo
//
//  También clasifica el hardware en tres tiers para limitar el peso de los GLB:
//   • low  (<2 GB RAM o ≤2 núcleos)  → maxModelSizeMB: 3   (solo modelos muy ligeros)
//   • mid  (2–4 GB RAM)              → maxModelSizeMB: 8
//   • high (>4 GB RAM)               → maxModelSizeMB: 20
//
//  Nota: navigator.deviceMemory es una API de baja resolución (valores: 0.25, 0.5,
//  1, 2, 4, 8). Puede ser undefined en Firefox/Safari → defaulteamos a 'mid'.
// ─────────────────────────────────────────────────────────────────────────────

function detectDeviceTier() {
  const mem  = navigator.deviceMemory          // GB, puede ser undefined
  const cpus = navigator.hardwareConcurrency   // núcleos lógicos, puede ser undefined

  if (!mem && !cpus) return 'mid' // sin info → tier conservador

  const ramGB   = mem  ?? 4
  const threads = cpus ?? 4

  if (ramGB <= 1 || threads <= 2) return 'low'
  if (ramGB <= 4)                  return 'mid'
  return 'high'
}

const MAX_MB_BY_TIER = { low: 3, mid: 8, high: 20 }

export function useARSupport() {
  const [state, setState] = useState({
    checked: false,
    webxr: false,
    ios: false,
    canShare: false,
    deviceTier: 'mid',
    maxModelSizeMB: 8,
    isAndroid: false,
  })

  useEffect(() => {
    let cancelled = false

    const ua = navigator.userAgent || ''

    const ios =
      /iPad|iPhone|iPod/.test(ua) ||
      // iPadOS se reporta como Mac con touch
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)

    const isAndroid = /Android/i.test(ua)

    const canShare = typeof navigator.share === 'function'

    const deviceTier     = detectDeviceTier()
    const maxModelSizeMB = MAX_MB_BY_TIER[deviceTier]

    const finish = (webxr) => {
      if (!cancelled)
        setState({ checked: true, webxr, ios, canShare, deviceTier, maxModelSizeMB, isAndroid })
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
