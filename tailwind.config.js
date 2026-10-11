/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        coffee: {
          50: '#FDF8F5',
          100: '#F7EDE4',
          200: '#ECCDBA',
          300: '#DEAA8B',
          400: '#CF855C',
          500: '#B86533',
          600: '#994E24',
          700: '#7B3B1C',
          800: '#5F2D16',
          900: '#3D1C0C',
          950: '#230E05'
        },
        google: {
          blue: '#1A73E8',
          red: '#EA4335',
          yellow: '#FBBC04',
          green: '#34A853'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'steam': 'steam 2s ease-in-out infinite alternate',
      },
      keyframes: {
        steam: {
          '0%': { transform: 'translateY(0) scaleX(1)', opacity: '0.4' },
          '100%': { transform: 'translateY(-6px) scaleX(1.1)', opacity: '0.9' },
        }
      }
    },
  },
  plugins: [],
}
