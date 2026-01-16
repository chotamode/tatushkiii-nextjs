import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        green: '#10B981',
        red: '#EF4444',
        blue: '#3B82F6',
        gray: '#6B7280',
      },
      borderWidth: {
        '3': '3px',
      },
    },
  },
  plugins: [],
}

export default config
