/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.template.html', './src/**/*.{js,ts,jsx,tsx,vue}'],
  theme: {
    extend: {}
  },
  plugins: [
    function ({ addVariant }) {
      addVariant('child', '& > *')
      addVariant('child-hover', '& > *:hover')
    }
  ]
  // prefix: 'tw-'
}
