import { Suspense, lazy } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'
import { getDishById } from '../data/menuData'

// El visor 3D es pesado: lo cargamos diferido para no penalizar el primer render.
const ModelPreview = lazy(() => import('./ar/ModelPreview'))

const HERO_DISH = getDishById('bife-chorizo')

export default function Hero({ onPrimary, onSecondary }) {
  const { t } = useLanguage()
  const [line1, line2] = t('hero.title').split('\n')

  return (
    <section id="top" className="relative overflow-hidden">
      {/* Halo cálido de fondo */}
      <div
        className="pointer-events-none absolute -right-40 -top-40 h-[460px] w-[460px] rounded-full opacity-60 blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(194,73,29,0.16), transparent 70%)' }}
        aria-hidden="true"
      />

      <div className="container-page grid items-center gap-10 py-14 md:grid-cols-2 md:gap-6 md:py-20">
        {/* Texto */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="eyebrow">{t('hero.eyebrow')}</span>
          <h1 className="mt-4 font-display text-[2.6rem] font-black leading-[1.04] text-balance text-ink sm:text-6xl">
            {line1}
            {line2 && (
              <>
                <br />
                <span className="text-stone">{line2}</span>
              </>
            )}
          </h1>
          <p className="mt-5 max-w-md font-sans text-base leading-relaxed text-stone">
            {t('hero.subtitle')}
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <button onClick={onPrimary} className="btn-ember">
              {t('hero.ctaPrimary')}
            </button>
            <button onClick={onSecondary} className="btn-ghost">
              {t('hero.ctaSecondary')}
            </button>
          </div>

          <p className="mt-5 flex items-center gap-2 font-sans text-xs text-stone">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-ember/12 text-ember">
              <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" aria-hidden="true">
                <path d="M12 2c1.5 3 4.5 4.5 4.5 8.5A4.5 4.5 0 0 1 12 15a4.5 4.5 0 0 1-4.5-4.5C7.5 8 9 6 12 2Z" />
              </svg>
            </span>
            {t('hero.tip')}
          </p>
        </motion.div>

        {/* Visor 3D del plato (firma de la marca) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="relative mx-auto aspect-square w-full max-w-md"
        >
          <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-b from-cream to-[#E7E2D9] shadow-card" />
          <div className="absolute inset-0 overflow-hidden rounded-[2rem]">
            <Suspense fallback={<div className="skeleton h-full w-full" />}>
              <ModelPreview model={HERO_DISH?.model || 'meat'} accent={HERO_DISH?.accent || '#C2491D'} />
            </Suspense>
          </div>
          <div className="absolute bottom-4 left-4 rounded-full bg-porcelain/90 px-3 py-1.5 backdrop-blur">
            <span className="font-sans text-[0.68rem] font-semibold uppercase tracking-label text-ink">
              {t('ar.enter3d')} · 360°
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
