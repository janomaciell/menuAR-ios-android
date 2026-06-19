import { motion } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'
import { formatPrice } from '../utils/format'
import DishImage from './DishImage'
import { TagPills, SpiceMeter } from './Badges'

export default function DishCard({ dish, onDetails, onAR, index = 0 }) {
  const { t, tr, lang } = useLanguage()

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.35) }}
      className="group flex flex-col overflow-hidden rounded-xl2 border border-hairline bg-porcelain shadow-card transition-shadow duration-300 hover:shadow-cardHover"
    >
      {/* Imagen + etiquetas */}
      <button onClick={() => onDetails?.(dish)} className="relative block aspect-[4/3] w-full overflow-hidden" aria-label={tr(dish.name)}>
        <DishImage
          dish={dish}
          className="h-full w-full transition-transform duration-700 group-hover:scale-[1.04]"
          sizes="(max-width: 768px) 100vw, 380px"
        />
        {dish.tags?.length > 0 && (
          <div className="absolute left-3 top-3">
            <TagPills tags={dish.tags.slice(0, 2)} />
          </div>
        )}
      </button>

      {/* Cuerpo */}
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-lg font-bold leading-tight text-ink">{tr(dish.name)}</h3>
          <span className="shrink-0 font-sans text-base font-semibold text-ember">
            {formatPrice(dish.price, lang)}
          </span>
        </div>

        <p className="mt-1.5 line-clamp-2 font-sans text-sm leading-relaxed text-stone">
          {tr(dish.description)}
        </p>

        {/* Metadatos */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="chip">
            <ClockIcon />
            {dish.prepTime} {t('card.minutes')}
          </span>
          {dish.spice > 0 && (
            <span className="chip">
              <SpiceMeter level={dish.spice} />
            </span>
          )}
        </div>

        {/* Acciones */}
        <div className="mt-4 flex items-center gap-2 pt-1">
          <button onClick={() => onAR?.(dish)} className="btn-ember flex-1 px-3 py-2.5 text-[0.82rem]">
            <CubeIcon />
            {t('card.ar')}
          </button>
          <button onClick={() => onDetails?.(dish)} className="btn-ghost px-3 py-2.5 text-[0.82rem]">
            {t('card.details')}
          </button>
        </div>
      </div>
    </motion.article>
  )
}

const ClockIcon = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
)

const CubeIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 8 12 3 3 8v8l9 5 9-5z" />
    <path d="M3 8l9 5 9-5M12 13v8" />
  </svg>
)
