// https://github.com/michael-ciniawsky/postcss-load-config

module.exports = {
  "plugins": {
    "postcss-preset-env": {},
    // https://github.com/evrone/postcss-px-to-viewport/blob/HEAD/README_CN.md
    'postcss-px-to-viewport': {
      viewportWidth: 750,
      unitPrecision: 2
    }
  }
}
