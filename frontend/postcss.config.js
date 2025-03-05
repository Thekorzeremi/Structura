module.exports = {
  plugins: [
    require('postcss-preset-mantine')(),
    require('postcss-simple-vars')(),
    require('tailwindcss'),
    require('autoprefixer'),
  ],
}
