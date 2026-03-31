/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        jarvis: {
          cyan: '#00d4ff',      // Tech, thinking, primary
          orange: '#ff6b35',    // Actions, alerts, CTAs
          purple: '#8264dc',    // AI personality, autonomous
          bg: {
            dark: '#0a0e14',    // Page background
            surface: '#0d1219',  // Cards, panels
            sidebar: '#080b0f',  // Sidebar bg
            card: '#141920',     // Hover states
          },
          text: {
            primary: '#e0e6ed',   // Main text
            secondary: '#8f9ba8', // Muted text
            muted: '#5c6773',     // Disabled text
          },
        },
      },
      fontFamily: {
        display: ['Orbitron', 'monospace'],       // Headings
        body: ['Rajdhani', 'sans-serif'],         // Body text
        mono: ['JetBrains Mono', 'monospace'],    // Code
      },
    },
  },
  plugins: [],
}
