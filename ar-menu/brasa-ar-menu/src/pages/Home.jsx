import { Suspense, lazy, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'
import { categories, dishes, getDishesByCategory, getDishById } from '../data/menuData'
import Header from '../components/Header'
import Hero from '../components/Hero'
import CategoryCard from '../components/CategoryCard'
import DishCard from '../components/DishCard'
import Footer from '../components/Footer'

// Pesados: se cargan solo cuando hacen falta
const DishModal = lazy(() => import('../components/DishModal'))
const ARViewer = lazy(() => import('../components/ar/ARViewer'))

export default function Home() {
  const { t, tr } = useLanguage()
  const [filter, setFilter] = useState('all')
  const [modalDish, setModalDish] = useState(null)
  const [arDish, setArDish] = useState(null)

  const visibleCategories = useMemo(
    () => (filter === 'all' ? categories : categories.filter((c) => c.id === filter)),
    [filter]
  )

  const openDetails = (dish) => setModalDish(dish)
  const openAR = (dish) => {
    setModalDish(null)
    setArDish(dish)
  }

  const goToMenu = () => {
    document.getElementById('carta')?.scrollIntoView({ behavior: 'smooth' })
  }
  const demoAR = () => openAR(getDishById('bife-chorizo') || dishes[0])

  return (
    <div className="min-h-screen bg-porcelain">
      <Header onSelectDish={openDetails} />

      <main>
        <Hero onPrimary={goToMenu} onSecondary={demoAR} />

        {/* Grilla de categorías */}
        <section id="categorias" className="container-page py-6">
          <div className="mb-6">
            <span className="eyebrow">{t('categoryTitle')}</span>
            <h2 className="mt-2 font-display text-3xl font-bold text-ink sm:text-4xl">
              {t('categorySubtitle')}
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {categories.map((cat, i) => (
              <CategoryCard
                key={cat.id}
                category={cat}
                index={i}
                onClick={(c) => {
                  setFilter(c.id)
                  document.getElementById('carta')?.scrollIntoView({ behavior: 'smooth' })
                }}
              />
            ))}
          </div>
        </section>

        {/* Carta con filtros */}
        <section id="carta" className="container-page scroll-mt-24 py-10">
          {/* Filtros (chips) */}
          <div className="sticky top-[68px] z-30 -mx-5 mb-8 bg-porcelain/85 px-5 py-3 backdrop-blur-md sm:top-[60px]">
            <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <Chip active={filter === 'all'} onClick={() => setFilter('all')}>
                {t('common.allCategories')}
              </Chip>
              {categories.map((c) => (
                <Chip key={c.id} active={filter === c.id} onClick={() => setFilter(c.id)}>
                  {tr(c.name)}
                </Chip>
              ))}
            </div>
          </div>

          {/* Secciones por categoría */}
          <div className="space-y-14">
            {visibleCategories.map((cat) => {
              const list = getDishesByCategory(cat.id)
              if (!list.length) return null
              return (
                <div key={cat.id} id={`cat-${cat.id}`} className="scroll-mt-32">
                  <div className="mb-5 flex items-end justify-between gap-4">
                    <div>
                      <h3 className="font-display text-2xl font-bold text-ink">{tr(cat.name)}</h3>
                      <p className="mt-1 max-w-xl font-sans text-sm text-stone">{tr(cat.description)}</p>
                    </div>
                    <span className="hidden shrink-0 font-sans text-sm text-stone sm:block">
                      {list.length} {t('dishCount')}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {list.map((dish, i) => (
                      <DishCard
                        key={dish.id}
                        dish={dish}
                        index={i}
                        onDetails={openDetails}
                        onAR={openAR}
                      />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      </main>

      <Footer />

      {/* Overlays diferidos */}
      <Suspense fallback={null}>
        {modalDish && (
          <DishModal dish={modalDish} open={!!modalDish} onClose={() => setModalDish(null)} onAR={openAR} />
        )}
        {arDish && <ARViewer dish={arDish} open={!!arDish} onClose={() => setArDish(null)} />}
      </Suspense>
    </div>
  )
}

function Chip({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-1.5 font-sans text-sm font-semibold transition ${
        active
          ? 'border-ink bg-ink text-porcelain'
          : 'border-hairline bg-porcelain text-stone hover:border-stone hover:text-ink'
      }`}
    >
      {children}
    </button>
  )
}
