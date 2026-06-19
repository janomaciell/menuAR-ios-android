/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // "Porcelana & brasa": la cerámica del plato + el fuego de la cocina.
        porcelain: '#F8F7F4', // fondo, como loza fina
        ink: '#1A1714',       // negro cálido, titulares
        stone: '#6B6258',     // texto secundario
        hairline: '#E6E1D9',  // bordes finos / divisores
        ember: '#C2491D',     // ÚNICO acento: el fuego de la brasa
        emberDark: '#9E3A16',
        charcoal: '#211D19',  // bandas oscuras de contraste
        cream: '#EFEBE3',     // superficies sutiles
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['"Hanken Grotesk"', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        label: '0.22em',
      },
      boxShadow: {
        card: '0 1px 2px rgba(26,23,20,0.04), 0 12px 32px -18px rgba(26,23,20,0.22)',
        cardHover: '0 2px 4px rgba(26,23,20,0.05), 0 28px 60px -28px rgba(26,23,20,0.35)',
        float: '0 24px 70px -30px rgba(26,23,20,0.5)',
      },
      borderRadius: {
        xl2: '1.4rem',
      },
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.6s infinite',
      },
    },
  },
  plugins: [],
}
