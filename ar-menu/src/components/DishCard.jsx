import { motion } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'
import { formatPrice } from '../utils/format'
import { TagPills, SpiceMeter } from './Badges'

export default function DishCard({ dish, onDetails, onAR, index = 0 }) {
  const { t, tr, lang } = useLanguage()

  const handleRowClick = (e) => {
    // Evitar abrir detalles si el usuario hizo click en botones de acción específicos
    if (e.target.closest('.ar-btn') || e.target.closest('.details-btn')) return
    onDetails?.(dish)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.03, 0.25) }}
      onClick={handleRowClick}
      className="group flex flex-col md:flex-row md:items-center justify-between gap-3 py-4 px-2 border-b border-hairline hover:bg-cream/20 transition-all duration-200 cursor-pointer"
    >
      {/* Cuerpo principal con información del plato */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 mb-1.5">
          <h4 className="font-display text-lg font-bold text-ink group-hover:text-ember transition-colors duration-200">
            {tr(dish.name)}
          </h4>
          <span className="font-sans text-base font-semibold text-ember">
            {formatPrice(dish.price, lang)}
          </span>
          {dish.tags?.length > 0 && (
            <div className="flex items-center gap-1">
              <TagPills tags={dish.tags.slice(0, 2)} />
            </div>
          )}
        </div>

        <p className="font-sans text-[0.85rem] text-stone leading-relaxed max-w-3xl line-clamp-2 md:line-clamp-1">
          {tr(dish.description)}
        </p>

        {/* Metadatos rápidos */}
        <div className="mt-2.5 flex items-center gap-3">
          <span className="flex items-center gap-1 font-sans text-xs text-stone">
            <ClockIcon />
            {dish.prepTime} {t('card.minutes')}
          </span>
          {dish.spice > 0 && (
            <span className="flex items-center gap-1 font-sans text-xs text-stone">
              <SpiceMeter level={dish.spice} />
            </span>
          )}
        </div>
      </div>

      {/* Botones de acción directos */}
      <div className="flex items-center gap-2 shrink-0 self-end md:self-center mt-2 md:mt-0">
        <button
          onClick={(e) => {
            e.stopPropagation()
            onAR?.(dish)
          }}
          className="ar-btn btn-ember px-3.5 py-2 text-xs flex items-center gap-1.5"
          aria-label={t('card.ar')}
        >
          <CubeIcon />
          <span>{t('card.ar')}</span>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDetails?.(dish)
          }}
          className="details-btn btn-ghost px-3.5 py-2 text-xs flex items-center gap-1"
          aria-label={t('card.details')}
        >
          <span>{t('card.details')}</span>
        </button>
      </div>
    </motion.div>
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
