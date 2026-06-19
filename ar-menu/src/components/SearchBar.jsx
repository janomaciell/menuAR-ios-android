import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { useDishSearch } from '../hooks/useDishSearch'
import { formatPrice } from '../utils/format'
import DishImage from './DishImage'

export default function SearchBar({ onSelect, className = '' }) {
  const { t, tr, lang } = useLanguage()
  const [query, setQuery] = useState('')
  const [openList, setOpenList] = useState(false)
  const wrapRef = useRef(null)
  const inputRef = useRef(null)
  const results = useDishSearch(query)

  // Cerrar al clickear afuera
  useEffect(() => {
    const onDocClick = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpenList(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [])

  const choose = (dish) => {
    onSelect?.(dish)
    setOpenList(false)
    setQuery('')
    inputRef.current?.blur()
  }

  const showList = openList && query.trim().length > 0

  return (
    <div ref={wrapRef} className={`relative ${className}`}>
      <div className="flex items-center gap-2 rounded-full border border-hairline bg-porcelain px-4 py-2.5 transition focus-within:border-stone">
        <SearchIcon />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpenList(true)
          }}
          onFocus={() => setOpenList(true)}
          placeholder={t('search.placeholder')}
          aria-label={t('search.label')}
          className="w-full bg-transparent font-sans text-sm text-ink outline-none placeholder:text-stone/70"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('')
              inputRef.current?.focus()
            }}
            aria-label={t('search.clear')}
            className="text-stone transition hover:text-ink"
          >
            <ClearIcon />
          </button>
        )}
      </div>

      {showList && (
        <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-50 overflow-hidden rounded-xl2 border border-hairline bg-porcelain shadow-cardHover">
          {results.length === 0 ? (
            <p className="px-4 py-5 font-sans text-sm text-stone">
              {t('search.empty')} “<span className="text-ink">{query}</span>”
            </p>
          ) : (
            <ul className="max-h-[60vh] overflow-y-auto py-1">
              {results.slice(0, 8).map((dish) => (
                <li key={dish.id}>
                  <button
                    onClick={() => choose(dish)}
                    className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition hover:bg-cream"
                  >
                    <DishImage dish={dish} className="h-11 w-11 flex-shrink-0 rounded-lg" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-sans text-sm font-semibold text-ink">
                        {tr(dish.name)}
                      </span>
                      <span className="block truncate font-sans text-xs text-stone">
                        {tr(dish.description)}
                      </span>
                    </span>
                    <span className="flex-shrink-0 font-sans text-xs font-semibold text-ember">
                      {formatPrice(dish.price, lang)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#6B6258" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
    <circle cx="11" cy="11" r="7" />
    <path d="m21 21-4.3-4.3" />
  </svg>
)

const ClearIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
)
