import { useState } from 'react'
import { useLanguage } from '../context/LanguageContext'

// Imagen de plato con carga diferida y placeholder generado al vuelo.
// Si la foto remota falla, mostramos un degradado con la inicial del plato,
// teñido con el `accent` del plato. Así la UI nunca queda "rota".
export default function DishImage({ dish, src, className = '', sizes, eager = false }) {
  const { tr } = useLanguage()
  const [status, setStatus] = useState('loading') // loading | loaded | error
  const url = src || dish?.image
  const accent = dish?.accent || '#C2491D'
  const name = tr(dish?.name) || 'BRASA'
  const initial = name.trim().charAt(0).toUpperCase()

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Esqueleto mientras carga */}
      {status === 'loading' && <div className="skeleton absolute inset-0" />}

      {/* Placeholder elegante si falla */}
      {status === 'error' && (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            background: `radial-gradient(120% 120% at 30% 20%, ${accent}22, transparent 60%), linear-gradient(135deg, #EFEBE3, #E6E1D9)`,
          }}
          aria-hidden="true"
        >
          <span className="font-display text-5xl" style={{ color: accent, opacity: 0.5 }}>
            {initial}
          </span>
        </div>
      )}

      {url && status !== 'error' && (
        <img
          src={url}
          alt={name}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          sizes={sizes}
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('error')}
          className={`h-full w-full object-cover transition-[opacity,transform] duration-700 ${
            status === 'loaded' ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
    </div>
  )
}
