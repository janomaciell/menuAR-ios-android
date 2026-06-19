import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react'
import { translations } from '../i18n/translations'

const LanguageContext = createContext(null)

const STORAGE_KEY = 'brasa-lang'

function detectInitial() {
  if (typeof window === 'undefined') return 'es'
  const saved = window.localStorage.getItem(STORAGE_KEY)
  if (saved === 'es' || saved === 'en') return saved
  const nav = window.navigator.language?.toLowerCase() ?? 'es'
  return nav.startsWith('en') ? 'en' : 'es'
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(detectInitial)

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, lang)
    document.documentElement.lang = lang
  }, [lang])

  // t('hero.title') -> string, con fallback al español si falta la clave
  const t = useCallback(
    (path) => {
      const read = (obj) => path.split('.').reduce((acc, k) => acc?.[k], obj)
      return read(translations[lang]) ?? read(translations.es) ?? path
    },
    [lang]
  )

  // Para campos bilingües de los datos: tr({ es, en })
  const tr = useCallback((field) => (field ? field[lang] ?? field.es : ''), [lang])

  const toggle = useCallback(() => setLang((l) => (l === 'es' ? 'en' : 'es')), [])

  const value = useMemo(() => ({ lang, setLang, toggle, t, tr }), [lang, toggle, t, tr])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage debe usarse dentro de <LanguageProvider>')
  return ctx
}
