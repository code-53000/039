/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        neon: {
          cyan: '#00f0ff',
          magenta: '#ff00ff',
          yellow: '#ffff00',
          blue: '#0066ff',
          green: '#00ff66',
        },
        bg: {
          dark: '#0a0a0f',
          darker: '#050508',
          grid: '#12121a',
        }
      },
      fontFamily: {
        display: ['"Press Start 2P"', 'cursive'],
        mono: ['VT323', 'monospace'],
        body: ['Orbitron', 'sans-serif'],
      },
      boxShadow: {
        'neon-cyan': '0 0 5px #00f0ff, 0 0 20px #00f0ff, 0 0 40px #00f0ff',
        'neon-magenta': '0 0 5px #ff00ff, 0 0 20px #ff00ff, 0 0 40px #ff00ff',
        'neon-yellow': '0 0 5px #ffff00, 0 0 20px #ffff00, 0 0 40px #ffff00',
        'neon-blue': '0 0 5px #0066ff, 0 0 20px #0066ff, 0 0 40px #0066ff',
        'neon-green': '0 0 5px #00ff66, 0 0 20px #00ff66, 0 0 40px #00ff66',
        'neon-white': '0 0 5px #fff, 0 0 20px #fff, 0 0 40px #fff',
      },
      animation: {
        'pulse-neon': 'pulse-neon 2s ease-in-out infinite',
        'flash-strong': 'flash-strong 0.15s ease-out',
        'float-up': 'float-up 1s ease-out forwards',
        'scanline': 'scanline 6s linear infinite',
        'shake': 'shake 0.3s ease-in-out',
      },
      keyframes: {
        'pulse-neon': {
          '0%, 100%': { opacity: '1', filter: 'brightness(1)' },
          '50%': { opacity: '0.8', filter: 'brightness(1.3)' },
        },
        'flash-strong': {
          '0%': { boxShadow: '0 0 5px #fff, 0 0 20px #fff, 0 0 60px #fff' },
          '100%': { boxShadow: 'none' },
        },
        'float-up': {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '100%': { transform: 'translateY(-60px)', opacity: '0' },
        },
        'scanline': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        'shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-5px)' },
          '75%': { transform: 'translateX(5px)' },
        },
      },
    },
  },
  plugins: [],
};
