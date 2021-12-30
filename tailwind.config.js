module.exports = {
  purge: ['./src/**/*.html', './src/**/*.js'],
  mode: 'jit',
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      spacing: {
        'main-span': '72px',
        'fb-space': '10px'
      },
      colors: {
        'primary': '#4a90e2'
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
