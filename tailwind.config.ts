import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './chrome-extension/src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        text: {
          primary: '#1F2937',    // Dark gray for primary text
          secondary: '#ffffff',  // Medium gray for secondary text
          tertiary: '#6B7280',   // Light gray for tertiary text
          muted: '#9CA3AF',      // Muted text
          inverse: '#F9FAFB',    // Light text for dark backgrounds
        },
        fontFamily: {
          sans: ['Inter', 'sans-serif'],
        },
      }
    },
  },
  plugins: [],
}

export default config 