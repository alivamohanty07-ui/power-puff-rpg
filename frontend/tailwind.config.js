/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        rpg: {
          bg: 'var(--rpg-bg)',
          card: 'var(--rpg-card)',
          'card-hover': 'var(--rpg-card-hover)',
          border: 'var(--rpg-border)',
          text: 'var(--rpg-text)',
          muted: 'var(--rpg-muted)',
          accent: 'var(--rpg-accent)',
          'accent-glow': 'var(--rpg-accent-glow)',
          secondary: 'var(--rpg-secondary)',
          gold: '#f59e0b',
          xp: '#8b5cf6',
          streak: '#f97316',
        }
      },
      fontFamily: {
        fantasy: ['Cinzel', 'serif'],
        display: ['Orbitron', 'sans-serif'],
        tech: ['Rajdhani', 'sans-serif'],
        pixel: ['"Press Start 2P"', 'cursive'],
        game: ['Orbitron', 'sans-serif'],
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'theme-glow': '0 0 25px -3px var(--rpg-accent-glow)',
        'theme-glow-lg': '0 0 50px -5px var(--rpg-accent-glow)',
        'hud-inset': 'inset 0 0 15px rgba(0, 0, 0, 0.6), 0 0 1px 1px var(--rpg-border)',
      },
      animation: {
        'float': 'float 4s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2.5s infinite linear',
        'scanlines': 'scanlines 8s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1', filter: 'drop-shadow(0 0 15px var(--rpg-accent-glow))' },
          '50%': { opacity: '0.75', filter: 'drop-shadow(0 0 6px var(--rpg-accent-glow))' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        scanlines: {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '0 100%' },
        }
      }
    },
  },
  plugins: [],
};
