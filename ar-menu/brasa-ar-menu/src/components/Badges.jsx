import { useLanguage } from '../context/LanguageContext'

const TAG_STYLES = {
  recommended: 'bg-ember/10 text-emberDark border-ember/20',
  new: 'bg-ink text-porcelain border-ink',
  vegan: 'bg-[#E8F0E6] text-[#3C6B3A] border-[#cfe0cb]',
  glutenFree: 'bg-[#F3ECDD] text-[#8A6D2F] border-[#e6d9bd]',
  spicy: 'bg-ember/10 text-emberDark border-ember/20',
}

export function TagPills({ tags = [], className = '' }) {
  const { t } = useLanguage()
  if (!tags.length) return null
  return (
    <div className={`flex flex-wrap gap-1.5 ${className}`}>
      {tags.map((tag) => (
        <span
          key={tag}
          className={`rounded-full border px-2.5 py-0.5 font-sans text-[0.66rem] font-semibold ${
            TAG_STYLES[tag] || 'border-hairline bg-cream text-stone'
          }`}
        >
          {t(`tags.${tag}`)}
        </span>
      ))}
    </div>
  )
}

// Medidor de picante: hasta 3 "llamas". Si es 0, no se muestra.
export function SpiceMeter({ level = 0, showLabel = false, className = '' }) {
  const { t } = useLanguage()
  if (!level) return null
  const max = 3
  return (
    <span className={`inline-flex items-center gap-1 ${className}`} title={t('spice.levels')[level]}>
      <span className="flex items-center gap-0.5" aria-hidden="true">
        {Array.from({ length: max }).map((_, i) => (
          <Flame key={i} active={i < level} />
        ))}
      </span>
      {showLabel && (
        <span className="font-sans text-[0.7rem] font-medium text-stone">{t('spice.levels')[level]}</span>
      )}
    </span>
  )
}

function Flame({ active }) {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true">
      <path
        d="M12 2c1.5 3 4.5 4.5 4.5 8.5A4.5 4.5 0 0 1 12 15a4.5 4.5 0 0 1-4.5-4.5C7.5 8 9 6 12 2Z M12 22a5 5 0 0 1-5-5c0-2 1-3.2 2.2-4.2A4 4 0 0 0 12 17a4 4 0 0 0 2.8-4.2C16 13.8 17 15 17 17a5 5 0 0 1-5 5Z"
        fill={active ? '#C2491D' : '#E6E1D9'}
      />
    </svg>
  )
}
