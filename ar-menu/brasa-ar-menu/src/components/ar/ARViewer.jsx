import { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '../../context/LanguageContext'
import { useARSupport } from '../../hooks/useARSupport'
import { formatPrice } from '../../utils/format'
import ARScene from './ARScene'

// Iconos inline (sin dependencias extra)
const Icon = {
  close: (p) => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" {...p}>
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  ),
  camera: (p) => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  ),
  share: (p) => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
      <path d="m8.6 13.5 6.8 4M15.4 6.5 8.6 10.5" />
    </svg>
  ),
  reset: (p) => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M3 2v6h6" /><path d="M3 13a9 9 0 1 0 3-7.7L3 8" />
    </svg>
  ),
  cube: (p) => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M21 8 12 3 3 8v8l9 5 9-5z" /><path d="M3 8l9 5 9-5M12 13v8" />
    </svg>
  ),
}

export default function ARViewer({ dish, open, onClose }) {
  const { t, tr, lang } = useLanguage()
  const ar = useARSupport()

  const glRef = useRef(null)
  const overlayRef = useRef(null)
  const dialogRef = useRef(null)
  const controlsRef = useRef({ rot: 0, scaleK: 1 })
  const gesture = useRef({ mode: null, lastX: 0, startDist: 0, startScale: 1 })

  const [arActive, setArActive] = useState(false)
  const [status, setStatus] = useState('idle') // idle | searching | tapToPlace | placed
  const [resetSignal, setResetSignal] = useState(0)
  const [toast, setToast] = useState('')
  const [error, setError] = useState('')

  const placed = status === 'placed'

  // Bloquear scroll del body y enfocar el diálogo mientras está abierto
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialogRef.current?.focus()
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  const stopAR = useCallback(async () => {
    const session = glRef.current?.xr?.getSession?.()
    if (session) {
      try {
        await session.end()
      } catch (_) {
        /* noop */
      }
    }
    setArActive(false)
  }, [])

  const handleClose = useCallback(async () => {
    await stopAR()
    setStatus('idle')
    setError('')
    onClose?.()
  }, [stopAR, onClose])

  // Cerrar con Escape
  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') handleClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, handleClose])

  const showToast = useCallback((msg) => {
    setToast(msg)
    window.clearTimeout(showToast._t)
    showToast._t = window.setTimeout(() => setToast(''), 1900)
  }, [])

  // ---- Iniciar WebAR (requiere gesto del usuario) ----
  const startAR = useCallback(async () => {
    setError('')
    if (!navigator.xr) {
      setError(t('ar.notSupported'))
      return
    }
    try {
      const session = await navigator.xr.requestSession('immersive-ar', {
        requiredFeatures: ['hit-test'],
        optionalFeatures: ['dom-overlay', 'local-floor'],
        domOverlay: { root: overlayRef.current },
      })
      const gl = glRef.current
      gl.xr.enabled = true
      await gl.xr.setSession(session)
      setArActive(true)
      setStatus('searching')
      session.addEventListener('end', () => {
        setArActive(false)
        setStatus('idle')
      })
    } catch (e) {
      setError(t('ar.permissionDenied'))
    }
  }, [t])

  const reset = useCallback(() => {
    controlsRef.current.rot = 0
    controlsRef.current.scaleK = 1
    setResetSignal((n) => n + 1)
  }, [])

  // ---- Capturar foto (compone el WebGL sobre fondo porcelana) ----
  const capture = useCallback(() => {
    const src = glRef.current?.domElement
    if (!src) return
    const c = document.createElement('canvas')
    c.width = src.width
    c.height = src.height
    const ctx = c.getContext('2d')
    ctx.fillStyle = '#F8F7F4'
    ctx.fillRect(0, 0, c.width, c.height)
    try {
      ctx.drawImage(src, 0, 0)
      const url = c.toDataURL('image/png')
      const a = document.createElement('a')
      a.href = url
      a.download = `brasa-${dish.id}.png`
      a.click()
      showToast(t('ar.captured'))
    } catch (_) {
      /* contexto WebGL sin preserveDrawingBuffer en algún navegador */
    }
  }, [dish, t, showToast])

  // ---- Compartir ----
  const share = useCallback(async () => {
    const src = glRef.current?.domElement
    try {
      if (src && navigator.canShare) {
        const blob = await new Promise((res) => src.toBlob(res, 'image/png'))
        const file = blob && new File([blob], `brasa-${dish.id}.png`, { type: 'image/png' })
        if (file && navigator.canShare({ files: [file] })) {
          await navigator.share({ files: [file], text: t('ar.shareText') })
          return
        }
      }
      if (navigator.share) {
        await navigator.share({ title: 'BRASA', text: t('ar.shareText'), url: window.location.href })
      } else {
        showToast(t('ar.shareText'))
      }
    } catch (_) {
      /* el usuario canceló */
    }
  }, [dish, t, showToast])

  // ---- Gestos táctiles (solo en AR, sobre el dom-overlay) ----
  const onTouchStart = (e) => {
    if (!placed) return
    if (e.touches.length === 1) {
      gesture.current.mode = 'rotate'
      gesture.current.lastX = e.touches[0].clientX
    } else if (e.touches.length === 2) {
      gesture.current.mode = 'pinch'
      const dx = e.touches[0].clientX - e.touches[1].clientX
      const dy = e.touches[0].clientY - e.touches[1].clientY
      gesture.current.startDist = Math.hypot(dx, dy)
      gesture.current.startScale = controlsRef.current.scaleK
    }
  }
  const onTouchMove = (e) => {
    if (!placed) return
    if (gesture.current.mode === 'rotate' && e.touches.length === 1) {
      const x = e.touches[0].clientX
      controlsRef.current.rot += (x - gesture.current.lastX) * 0.01
      gesture.current.lastX = x
    } else if (gesture.current.mode === 'pinch' && e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX
      const dy = e.touches[0].clientY - e.touches[1].clientY
      const dist = Math.hypot(dx, dy)
      const next = gesture.current.startScale * (dist / (gesture.current.startDist || 1))
      controlsRef.current.scaleK = Math.min(2.4, Math.max(0.45, next))
    }
  }
  const onTouchEnd = (e) => {
    gesture.current.mode = e.touches.length ? gesture.current.mode : null
  }

  if (!open) return null

  const statusText =
    status === 'placed'
      ? t('ar.placed')
      : status === 'tapToPlace'
        ? t('ar.tapToPlace')
        : t('ar.searching')

  const statusSub = status === 'searching' ? t('ar.moveDevice') : null

  return (
    <AnimatePresence>
      <motion.div
        key="ar"
        className="fixed inset-0 z-[100] bg-charcoal"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        role="dialog"
        aria-modal="true"
        aria-label={`${t('ar.title')} — ${tr(dish.name)}`}
        ref={dialogRef}
        tabIndex={-1}
      >
        {/* Lienzo 3D persistente: hace de visor o de capa WebGL del AR */}
        <Canvas
          shadows
          dpr={[1, 2]}
          gl={{ alpha: true, antialias: true, preserveDrawingBuffer: true }}
          camera={{ position: [0, 1.2, 2.9], fov: 40 }}
          onCreated={({ gl }) => {
            glRef.current = gl
          }}
          style={{ position: 'absolute', inset: 0, background: arActive ? 'transparent' : undefined }}
        >
          <Suspense fallback={null}>
            <ARScene
              model={dish.model}
              accent={dish.accent}
              arActive={arActive}
              controlsRef={controlsRef}
              resetSignal={resetSignal}
              onStatus={setStatus}
            />
          </Suspense>
        </Canvas>

        {/* Fondo degradado suave para el modo visor (no en AR) */}
        {!arActive && (
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-porcelain via-cream to-[#E7E2D9]" style={{ zIndex: -1 }} />
        )}

        {/* dom-overlay raíz: toda la UI del AR vive acá */}
        <div ref={overlayRef} className="absolute inset-0" style={{ pointerEvents: 'none' }}>
          {/* Capa de gestos: solo activa con el plato colocado */}
          {arActive && placed && (
            <div
              className="absolute inset-0"
              style={{ pointerEvents: 'auto' }}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            />
          )}

          {/* Barra superior */}
          <div className="absolute left-0 right-0 top-0 flex items-center justify-between px-4 pt-[max(1rem,env(safe-area-inset-top))]">
            <div
              className="flex items-center gap-2 rounded-full bg-charcoal/60 px-3 py-1.5 backdrop-blur-md"
              style={{ pointerEvents: 'auto' }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-ember" />
              <span className="font-sans text-[0.7rem] font-semibold uppercase tracking-label text-porcelain">
                {t('ar.title')}
              </span>
            </div>
            <button
              onClick={handleClose}
              aria-label={t('ar.controls.close')}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-charcoal/60 text-porcelain backdrop-blur-md transition hover:bg-charcoal/80"
              style={{ pointerEvents: 'auto' }}
            >
              <Icon.close />
            </button>
          </div>

          {/* Píldora de estado (solo en AR) */}
          {arActive && (
            <div className="absolute left-1/2 top-[22%] -translate-x-1/2 px-6 text-center">
              <div className="inline-flex flex-col items-center gap-1 rounded-2xl bg-charcoal/55 px-5 py-3 backdrop-blur-md">
                <span className="font-sans text-sm font-semibold text-porcelain">{statusText}</span>
                {statusSub && <span className="font-sans text-[0.72rem] text-porcelain/70">{statusSub}</span>}
              </div>
            </div>
          )}

          {/* Panel inferior */}
          <div className="absolute bottom-0 left-0 right-0 px-4 pb-[max(1.1rem,env(safe-area-inset-bottom))]">
            <ARBottomPanel
              ar={ar}
              arActive={arActive}
              placed={placed}
              dish={dish}
              lang={lang}
              t={t}
              tr={tr}
              error={error}
              onStart={startAR}
              onReset={reset}
              onCapture={capture}
              onShare={share}
              Icon={Icon}
            />
          </div>

          {/* Toast */}
          <AnimatePresence>
            {toast && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                className="absolute bottom-[30%] left-1/2 -translate-x-1/2 rounded-full bg-ink/90 px-4 py-2"
              >
                <span className="font-sans text-xs font-semibold text-porcelain">{toast}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

// ---------------------------------------------------------------------------
// Panel inferior: cambia según el tier (Android WebXR / iOS / desktop)
// ---------------------------------------------------------------------------
function ARBottomPanel({ ar, arActive, placed, dish, lang, t, tr, error, onStart, onReset, onCapture, onShare, Icon }) {
  // Controles activos durante la sesión AR
  if (arActive) {
    return (
      <div className="mx-auto flex max-w-md items-center justify-center gap-3" style={{ pointerEvents: 'auto' }}>
        <RoundBtn label={t('ar.controls.reset')} onClick={onReset} disabled={!placed} Icon={Icon.reset} />
        <RoundBtn label={t('ar.controls.capture')} onClick={onCapture} disabled={!placed} Icon={Icon.camera} primary />
        <RoundBtn label={t('ar.controls.share')} onClick={onShare} disabled={!placed} Icon={Icon.share} />
      </div>
    )
  }

  // Tarjeta de contexto + acción, según dispositivo
  return (
    <div className="mx-auto max-w-md rounded-2xl bg-porcelain/95 p-4 shadow-float backdrop-blur" style={{ pointerEvents: 'auto' }}>
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-display text-lg leading-tight text-ink">{tr(dish.name)}</p>
          <p className="font-sans text-sm font-semibold text-ember">{formatPrice(dish.price, lang)}</p>
        </div>
        <span className="chip whitespace-nowrap">{t('ar.realProportions')}</span>
      </div>

      {error && <p className="mt-3 rounded-lg bg-ember/10 px-3 py-2 font-sans text-xs text-emberDark">{error}</p>}

      <div className="mt-4">
        {ar.webxr ? (
          <button onClick={onStart} className="btn-ember w-full">
            {t('ar.start')}
          </button>
        ) : ar.ios ? (
          <div className="space-y-3">
            {/* model-viewer con AR Quick Look para iOS */}
            <model-viewer
              src={dish.model}
              alt={tr(dish.name)}
              ar
              ar-modes="quick-look"
              camera-controls
              auto-rotate
              shadow-intensity="1"
              style={{
                width: '100%',
                height: '200px',
                borderRadius: '0.75rem',
                background: 'transparent',
              }}
            />
            <button
              onClick={() => {
                const mv = document.querySelector('model-viewer')
                if (mv) mv.activateAR()
              }}
              className="btn-ember w-full"
            >
              <Icon.cube style={{ marginRight: '0.4rem' }} />
              {t('ar.enter3d')}
            </button>
            <p className="text-center font-sans text-[0.72rem] leading-relaxed text-stone">{t('ar.iosNote')}</p>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2 rounded-full border border-hairline bg-cream/70 px-4 py-3">
              <Icon.cube />
              <span className="font-sans text-sm font-semibold text-ink">{t('ar.enter3d')}</span>
            </div>
            <p className="text-center font-sans text-[0.72rem] leading-relaxed text-stone">{t('ar.fallbackHint')}</p>
          </div>
        )}
      </div>
    </div>
  )
}

function RoundBtn({ label, onClick, disabled, Icon, primary }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={[
        'flex items-center justify-center rounded-full backdrop-blur-md transition',
        primary ? 'h-16 w-16 bg-ember text-porcelain' : 'h-12 w-12 bg-porcelain/85 text-ink',
        disabled ? 'opacity-40' : 'hover:scale-105 active:scale-95',
      ].join(' ')}
    >
      <Icon />
    </button>
  )
}
