import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: '#F8F5F0',
        'off-white': '#FAFAF8',
        dark: '#1A1A18',
        mid: '#4A4A46',
        light: '#8A8A84',
        accent: '#2C6E5A',
        'accent-light': '#E8F2EE',
        'accent-mid': '#4A9B82',
        'accent-dark': '#1F5242',
        gold: '#B8956A',
        'gold-light': '#D4B896',
        'line-green': '#06C755',
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        serif: ['Cormorant Garamond', 'serif'],
      },
    },
  },
  plugins: [],
}

export default config
