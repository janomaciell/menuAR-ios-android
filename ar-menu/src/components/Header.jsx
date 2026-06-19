import { useEffect, useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import SearchBar from './SearchBar'

export default function Header({ onSelectDish }) {
  const { t, lang, setLang } = useLanguage()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-all duration-300 ${
        scrolled
          ? 'border-hairline bg-porcelain/85 backdrop-blur-md'
          : 'border-transparent bg-porcelain'
      }`}
    >
      <div className="container-page flex items-center gap-4 py-3">
        {/* Marca */}
        <a href="#top" className="group flex shrink-0 items-baseline gap-2" aria-label="BRASA">
          <span className="font-display text-2xl font-black tracking-tight text-ink">
            {t('brand')}
          </span>
          <span className="hidden font-sans text-[0.62rem] uppercase tracking-label text-ember sm:inline">
            {t('brandTagline')}
          </span>
        </a>

        {/* Buscador (ocupa el centro en desktop) */}
        <div className="ml-auto hidden max-w-sm flex-1 md:block">
          <SearchBar onSelect={onSelectDish} />
        </div>

        {/* Selector de idioma */}
        <div
          className="ml-auto flex shrink-0 items-center rounded-full border border-hairline p-0.5 md:ml-0"
          role="group"
          aria-label={t('lang.label')}
        >
          {['es', 'en'].map((code) => (
            <button
              key={code}
              onClick={() => setLang(code)}
              aria-pressed={lang === code}
              className={`rounded-full px-2.5 py-1 font-sans text-xs font-semibold transition ${
                lang === code ? 'bg-ink text-porcelain' : 'text-stone hover:text-ink'
              }`}
            >
              {t(`lang.${code}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Buscador en mobile */}
      <div className="container-page pb-3 md:hidden">
        <SearchBar onSelect={onSelectDish} />
      </div>
    </header>
  )
}
