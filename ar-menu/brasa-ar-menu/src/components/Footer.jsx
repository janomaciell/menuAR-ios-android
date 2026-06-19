import { useLanguage } from '../context/LanguageContext'

export default function Footer() {
  const { t } = useLanguage()
  const year = new Date().getFullYear()

  return (
    <footer className="mt-16 bg-charcoal text-porcelain">
      <div className="container-page py-12">
        <div className="grid gap-8 sm:grid-cols-3">
          {/* Marca */}
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-2xl font-black">{t('brand')}</span>
              <span className="font-sans text-[0.62rem] uppercase tracking-label text-ember">
                {t('brandTagline')}
              </span>
            </div>
            <p className="mt-3 max-w-xs font-sans text-sm leading-relaxed text-porcelain/65">
              {t('footer.built')}.
            </p>
          </div>

          {/* Datos */}
          <div className="space-y-4">
            <div>
              <p className="eyebrow-muted text-porcelain/50">{t('footer.hours')}</p>
              <p className="mt-1 font-sans text-sm text-porcelain/90">{t('footer.hoursValue')}</p>
            </div>
            <div>
              <p className="eyebrow-muted text-porcelain/50">{t('footer.address')}</p>
              <p className="mt-1 font-sans text-sm text-porcelain/90">{t('footer.addressValue')}</p>
            </div>
          </div>

          {/* Reserva */}
          <div className="sm:text-right">
            <a
              href="#top"
              className="inline-flex items-center gap-2 rounded-full bg-ember px-5 py-3 font-sans text-sm font-semibold text-porcelain transition hover:bg-emberDark"
            >
              {t('footer.reserve')}
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-2 border-t border-porcelain/15 pt-6 sm:flex-row sm:items-center">
          <p className="font-sans text-xs text-porcelain/50">
            © {year} {t('brand')}. {t('footer.rights')}
          </p>
          <p className="font-sans text-xs text-porcelain/40">Pinamar · Argentina</p>
        </div>
      </div>
    </footer>
  )
}
