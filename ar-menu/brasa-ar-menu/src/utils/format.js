// Formateo de precios. Por defecto ARS, pero parametrizable.
export function formatPrice(value, lang = 'es', currency = 'ARS') {
  const locale = lang === 'en' ? 'en-US' : 'es-AR'
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(value)
  } catch {
    return `$${value.toLocaleString(locale)}`
  }
}
