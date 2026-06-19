import { motion } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'
import { getDishesByCategory } from '../data/menuData'

export default function CategoryCard({ category, onClick, index = 0 }) {
  const { tr, t } = useLanguage()
  const count = getDishesByCategory(category.id).length

  return (
    <motion.button
      onClick={() => onClick?.(category)}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.04, 0.3) }}
      className="group relative block aspect-[4/5] w-full overflow-hidden rounded-xl2 text-left shadow-card transition-shadow duration-300 hover:shadow-cardHover"
    >
      {/* Imagen de portada */}
      <img
        src={category.cover}
        alt={tr(category.name)}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      {/* Velado para legibilidad */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/25 to-transparent" />

      {/* Contenido */}
      <div className="absolute inset-x-0 bottom-0 p-4">
        <div className="mb-1 flex items-center gap-2">
          <h3 className="font-display text-xl font-bold text-porcelain">{tr(category.name)}</h3>
          <span className="rounded-full bg-porcelain/20 px-2 py-0.5 font-sans text-[0.62rem] font-semibold text-porcelain backdrop-blur">
            {count} {t('dishCount')}
          </span>
        </div>
        <p className="line-clamp-2 font-sans text-xs leading-relaxed text-porcelain/80">
          {tr(category.description)}
        </p>
        <span className="mt-2 inline-flex items-center gap-1 font-sans text-xs font-semibold text-porcelain">
          {t('viewCategory')}
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="transition-transform group-hover:translate-x-0.5" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </span>
      </div>
    </motion.button>
  )
}
