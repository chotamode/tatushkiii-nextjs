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
        // The brand's off-black — wired to the same CSS var globals.css uses
        // for body text, so bg-ink/text-ink/border-ink (and their /NN opacity
        // variants) always match instead of drifting from Tailwind's pure
        // #000000 `black`. (`white`/`paper` need no equivalent: `white` is
        // already identical to --color-white, and --color-paper already has
        // its own hand-written .bg-paper utility in globals.css.)
        ink: 'var(--color-black)',
      },
      borderWidth: {
        '3': '3px',
      },
    },
  },
  plugins: [],
}

export default config
