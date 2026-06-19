import { useMemo } from 'react'
import { dishes } from '../data/menuData'

// Normaliza para búsqueda tolerante a acentos y mayúsculas
const normalize = (s = '') =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()

export function useDishSearch(query) {
  return useMemo(() => {
    const q = normalize(query)
    if (!q) return []

    return dishes.filter((d) => {
      const haystack = [
        d.name.es,
        d.name.en,
        d.description.es,
        d.description.en,
        ...(d.ingredients.es || []),
        ...(d.ingredients.en || []),
        d.category,
        ...(d.tags || []),
      ]
        .map(normalize)
        .join(' ')
      return haystack.includes(q)
    })
  }, [query])
}
