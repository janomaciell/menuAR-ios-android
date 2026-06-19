import { Suspense, lazy, useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { getDishById, getCategoryById } from '../data/menuData'
import { formatPrice } from '../utils/format'
import Header from '../components/Header'
import Footer from '../components/Footer'
import DishImage from '../components/DishImage'
import { TagPills, SpiceMeter } from '../components/Badges'

const ARViewer = lazy(() => import('../components/ar/ARViewer'))

export default function DishPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t, tr, lang } = useLanguage()
  const dish = getDishById(id)
  const [arOpen, setArOpen] = useState(false)
  const [active, setActive] = useState(0)

  // SEO: título del documento por plato
  useEffect(() => {
    if (dish) {
      document.title = `${tr(dish.name)} · BRASA`
    }
    return () => {
      document.title = 'BRASA · Cocina de Fuego'
    }
  }, [dish, tr])

  if (!dish) {
    return (
      <div className="min-h-screen bg-porcelain">
        <Header onSelectDish={(d) => navigate(`/dish/${d.id}`)} />
        <div className="container-page py-24 text-center">
          <p className="font-display text-2xl text-ink">404</p>
          <Link to="/" className="btn-ghost mt-4 inline-flex">
            {t('common.back')}
          </Link>
        </div>
      </div>
    )
  }

  const cat = getCategoryById(dish.category)
  const gallery = dish.gallery?.length ? dish.gallery : [dish.image]

  return (
    <div className="min-h-screen bg-porcelain">
      <Header onSelectDish={(d) => navigate(`/dish/${d.id}`)} />

      <main className="container-page py-8">
        <button onClick={() => navigate(-1)} className="mb-6 inline-flex items-center gap-2 font-sans text-sm font-semibold text-stone transition hover:text-ink">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M19 12H5M11 6l-6 6 6 6" />
          </svg>
          {t('common.back')}
        </button>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Imágenes */}
          <div>
            <DishImage dish={dish} src={gallery[active]} className="aspect-[4/3] w-full rounded-xl2 shadow-card" eager />
            {gallery.length > 1 && (
              <div className="mt-3 flex gap-2">
                {gallery.map((g, i) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    className={`h-16 w-16 overflow-hidden rounded-lg border-2 transition ${
                      active === i ? 'border-ember' : 'border-transparent opacity-70'
                    }`}
                    aria-label={`${t('modal.gallery')} ${i + 1}`}
                  >
                    <DishImage dish={dish} src={g} className="h-full w-full" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Detalle */}
          <div>
            {cat && <span className="eyebrow">{tr(cat.name)}</span>}
            <h1 className="mt-2 font-display text-4xl font-bold leading-tight text-ink">{tr(dish.name)}</h1>
            <div className="mt-3">
              <TagPills tags={dish.tags} />
            </div>

            <p className="mt-4 font-sans text-base leading-relaxed text-stone">
              {tr(dish.longDescription) || tr(dish.description)}
            </p>

            <div className="mt-5 flex items-center gap-4">
              <span className="font-display text-3xl font-bold text-ember">{formatPrice(dish.price, lang)}</span>
              <span className="chip">
                {t('modal.prep')}: {dish.prepTime} {t('card.minutes')}
              </span>
              {dish.spice > 0 && (
                <span className="chip">
                  <SpiceMeter level={dish.spice} showLabel />
                </span>
              )}
            </div>

            <button onClick={() => setArOpen(true)} className="btn-ember mt-6 w-full sm:w-auto">
              <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 8 12 3 3 8v8l9 5 9-5z" />
                <path d="M3 8l9 5 9-5M12 13v8" />
              </svg>
              {t('card.ar')}
            </button>

            {/* Ingredientes */}
            <div className="mt-8">
              <h2 className="eyebrow-muted mb-2">{t('modal.ingredients')}</h2>
              <div className="flex flex-wrap gap-1.5">
                {tr(dish.ingredients).map((ing) => (
                  <span key={ing} className="rounded-full bg-cream px-3 py-1 font-sans text-xs text-ink">
                    {ing}
                  </span>
                ))}
              </div>
            </div>

            {/* Nutrición */}
            <div className="mt-6 grid grid-cols-4 gap-2">
              {[
                [t('modal.kcal'), dish.nutrition.kcal],
                [t('modal.protein'), `${dish.nutrition.protein}g`],
                [t('modal.carbs'), `${dish.nutrition.carbs}g`],
                [t('modal.fat'), `${dish.nutrition.fat}g`],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl bg-cream/70 px-2 py-3 text-center">
                  <p className="font-display text-lg font-bold text-ink">{value}</p>
                  <p className="mt-0.5 font-sans text-[0.62rem] uppercase tracking-wide text-stone">{label}</p>
                </div>
              ))}
            </div>

            {/* Maridaje */}
            {tr(dish.pairing) && (
              <div className="mt-6">
                <h2 className="eyebrow-muted mb-2">{t('modal.pairing')}</h2>
                <p className="rounded-xl bg-cream/70 px-4 py-3 font-sans text-sm italic text-ink">{tr(dish.pairing)}</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />

      <Suspense fallback={null}>
        {arOpen && <ARViewer dish={dish} open={arOpen} onClose={() => setArOpen(false)} />}
      </Suspense>
    </div>
  )
}
