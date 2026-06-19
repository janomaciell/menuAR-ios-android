import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'
import { formatPrice } from '../utils/format'
import DishImage from './DishImage'
import { TagPills, SpiceMeter } from './Badges'

export default function DishModal({ dish, open, onClose, onAR }) {
  const { t, tr, lang } = useLanguage()
  const [active, setActive] = useState(0)
  const panelRef = useRef(null)

  useEffect(() => {
    setActive(0)
  }, [dish])

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    panelRef.current?.focus()
    const onKey = (e) => e.key === 'Escape' && onClose?.()
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  if (!dish) return null
  const gallery = dish.gallery?.length ? dish.gallery : [dish.image]

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-end justify-center sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Telón */}
          <div className="absolute inset-0 bg-ink/55 backdrop-blur-sm" onClick={onClose} />

          {/* Panel */}
          <motion.div
            ref={panelRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label={tr(dish.name)}
            initial={{ y: 40, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 30, opacity: 0, scale: 0.98 }}
            transition={{ type: 'spring', damping: 30, stiffness: 320 }}
            className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-[1.6rem] bg-porcelain shadow-float outline-none sm:rounded-[1.6rem]"
          >
            {/* Botón cerrar */}
            <button
              onClick={onClose}
              aria-label={t('modal.close')}
              className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-porcelain/90 text-ink shadow-card backdrop-blur transition hover:bg-porcelain"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>

            {/* Imagen principal */}
            <DishImage dish={dish} src={gallery[active]} className="aspect-[16/10] w-full" eager />

            {/* Galería */}
            {gallery.length > 1 && (
              <div className="flex gap-2 px-5 pt-3">
                {gallery.map((g, i) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    aria-label={`${t('modal.gallery')} ${i + 1}`}
                    className={`h-14 w-14 overflow-hidden rounded-lg border-2 transition ${
                      active === i ? 'border-ember' : 'border-transparent opacity-70'
                    }`}
                  >
                    <DishImage dish={dish} src={g} className="h-full w-full" />
                  </button>
                ))}
              </div>
            )}

            {/* Contenido */}
            <div className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-display text-2xl font-bold leading-tight text-ink">{tr(dish.name)}</h2>
                  <div className="mt-2">
                    <TagPills tags={dish.tags} />
                  </div>
                </div>
                <span className="shrink-0 font-display text-2xl font-bold text-ember">
                  {formatPrice(dish.price, lang)}
                </span>
              </div>

              <p className="mt-3 font-sans text-[0.95rem] leading-relaxed text-stone">
                {tr(dish.longDescription) || tr(dish.description)}
              </p>

              {/* Meta rápida */}
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="chip">
                  {t('modal.prep')}: {dish.prepTime} {t('card.minutes')}
                </span>
                {dish.spice > 0 && (
                  <span className="chip">
                    {t('spice.label')}: <SpiceMeter level={dish.spice} />
                  </span>
                )}
              </div>

              {/* Ingredientes */}
              <Section title={t('modal.ingredients')}>
                <div className="flex flex-wrap gap-1.5">
                  {tr(dish.ingredients).map((ing) => (
                    <span key={ing} className="rounded-full bg-cream px-3 py-1 font-sans text-xs text-ink">
                      {ing}
                    </span>
                  ))}
                </div>
              </Section>

              {/* Nutrición */}
              <Section title={t('modal.nutrition')}>
                <div className="grid grid-cols-4 gap-2">
                  <NutriCell label={t('modal.kcal')} value={dish.nutrition.kcal} />
                  <NutriCell label={t('modal.protein')} value={`${dish.nutrition.protein}g`} />
                  <NutriCell label={t('modal.carbs')} value={`${dish.nutrition.carbs}g`} />
                  <NutriCell label={t('modal.fat')} value={`${dish.nutrition.fat}g`} />
                </div>
              </Section>

              {/* Alérgenos */}
              <Section title={t('modal.allergens')}>
                {tr(dish.allergens)?.length ? (
                  <div className="flex flex-wrap gap-1.5">
                    {tr(dish.allergens).map((a) => (
                      <span key={a} className="rounded-full border border-hairline px-3 py-1 font-sans text-xs text-stone">
                        {a}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="font-sans text-sm text-stone">{t('modal.noAllergens')}</p>
                )}
              </Section>

              {/* Maridaje */}
              {tr(dish.pairing) && (
                <Section title={t('modal.pairing')}>
                  <p className="rounded-xl bg-cream/70 px-4 py-3 font-sans text-sm italic text-ink">
                    {tr(dish.pairing)}
                  </p>
                </Section>
              )}

              {/* Opiniones */}
              {dish.reviews?.length > 0 && (
                <Section title={t('modal.reviews')}>
                  <div className="space-y-2.5">
                    {dish.reviews.map((r, i) => (
                      <div key={i} className="rounded-xl border border-hairline p-3">
                        <div className="flex items-center justify-between">
                          <span className="font-sans text-sm font-semibold text-ink">{r.author}</span>
                          <Stars n={r.rating} />
                        </div>
                        <p className="mt-1 font-sans text-sm leading-relaxed text-stone">{r[lang] || r.es}</p>
                      </div>
                    ))}
                  </div>
                </Section>
              )}

              {/* CTA AR */}
              <button onClick={() => onAR?.(dish)} className="btn-ember mt-6 w-full">
                <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 8 12 3 3 8v8l9 5 9-5z" />
                  <path d="M3 8l9 5 9-5M12 13v8" />
                </svg>
                {t('card.ar')}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Section({ title, children }) {
  return (
    <div className="mt-5">
      <h3 className="eyebrow-muted mb-2">{title}</h3>
      {children}
    </div>
  )
}

function NutriCell({ label, value }) {
  return (
    <div className="rounded-xl bg-cream/70 px-2 py-3 text-center">
      <p className="font-display text-lg font-bold text-ink">{value}</p>
      <p className="mt-0.5 font-sans text-[0.62rem] uppercase tracking-wide text-stone">{label}</p>
    </div>
  )
}

function Stars({ n = 5 }) {
  return (
    <span className="flex items-center gap-0.5" aria-label={`${n}/5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 24 24" width="13" height="13" fill={i < n ? '#C2491D' : '#E6E1D9'} aria-hidden="true">
          <path d="m12 2 2.9 6.3 6.8.7-5 4.6 1.4 6.7L12 17.8 5.9 20.9 7.3 14.2l-5-4.6 6.8-.7z" />
        </svg>
      ))}
    </span>
  )
}
