/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          light: '#F4C430',
          DEFAULT: '#D4AF37',
        },
        yellow: {
          400: '#F4C430',
          500: '#D4AF37',
        },
        blue: {
          default: '#2C3E50',
          light: '#1A242F',
        }
      },
      fontFamily: {
        'playfair': ['"Playfair Display"', 'serif'],
      },
    },
  },
  plugins: [],
};
