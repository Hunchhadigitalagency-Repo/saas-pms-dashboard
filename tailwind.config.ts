import type { Config } from 'tailwindcss'

export default {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#373643',
        secondary: '#18cb96',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config
