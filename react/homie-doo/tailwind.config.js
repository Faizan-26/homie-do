/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF6347',
          dark: '#e54632',
        },
        background: {
          DEFAULT: '#fff5e9',
          light: '#fff',
        },
        text: {
          primary: '#333',
          secondary: '#555',
          light: '#fff',
        },
        border: {
          DEFAULT: '#e0e0e0',
          focus: '#FF6347',
        },
        ring: {
          DEFAULT: '#FF6347',
        },
        foreground: {
          DEFAULT: '#333',
          light: '#fff',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Open Sans', 'Helvetica Neue', 'sans-serif'],
        secondary: ['Roboto', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '12px',
        lg: '15px',
      },
      boxShadow: {
        DEFAULT: '0 2px 10px rgba(0, 0, 0, 0.07)',
        hover: '0 10px 25px rgba(0, 0, 0, 0.08)',
        button: '0 4px 15px rgba(255, 99, 71, 0.25)',
        buttonHover: '0 8px 20px rgba(255, 99, 71, 0.35)',
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

