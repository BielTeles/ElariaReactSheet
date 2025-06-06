/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cores temáticas de Elaria baseadas nos elementos
        terra: {
          50: '#faf8f5',
          100: '#f5f0e8',
          500: '#8B4513',
          600: '#7a3d11',
          700: '#6a350f',
          800: '#5a2d0d',
          900: '#4a250b',
        },
        agua: {
          50: '#f0f8ff',
          100: '#e0f0fe',
          500: '#4682B4',
          600: '#3e74a2',
          700: '#366690',
          800: '#2e587e',
          900: '#264a6c',
        },
        fogo: {
          50: '#fef2f2',
          100: '#fee2e2',
          500: '#DC143C',
          600: '#c61236',
          700: '#b01030',
          800: '#9a0e2a',
          900: '#840c24',
        },
        natureza: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#228B22',
          600: '#1f7d1f',
          700: '#1c6f1c',
          800: '#196119',
          900: '#165316',
        },
        luz: {
          50: '#fffef7',
          100: '#fffaeb',
          500: '#FFD700',
          600: '#e6c200',
          700: '#ccad00',
          800: '#b39800',
          900: '#998300',
        },
        sombra: {
          50: '#faf7ff',
          100: '#f3edff',
          500: '#4B0082',
          600: '#430074',
          700: '#3b0066',
          800: '#330058',
          900: '#2b004a',
        },
        // Sistema de cores com melhor contraste
        texto: {
          primary: '#0f172a',     // slate-900 mais escuro
          secondary: '#334155',   // slate-700 mais escuro
          muted: '#475569',      // slate-600 mais escuro
          light: '#f8fafc',      // para fundos escuros
          contrast: '#ffffff',    // branco puro para máximo contraste
        },
        fundo: {
          primary: '#ffffff',     // branco puro
          secondary: '#f8fafc',   // slate-50
          tertiary: '#f1f5f9',   // slate-100
          card: '#ffffff',        // branco para cards
        },
      },
      fontFamily: {
        'fantasy': ['Cinzel', 'serif'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      gridTemplateColumns: {
        '15': 'repeat(15, minmax(0, 1fr))',
        '16': 'repeat(16, minmax(0, 1fr))',
      },
      gridColumn: {
        'span-15': 'span 15 / span 15',
        'span-16': 'span 16 / span 16',
      },
    },
  },
  plugins: [],
} 