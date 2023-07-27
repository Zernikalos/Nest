const path = require('path')

module.exports = {
  plugins: [
      require('autoprefixer'),
      require('tailwindcss')(path.join(__dirname,'tailwind.config.js')),
  ],
}
