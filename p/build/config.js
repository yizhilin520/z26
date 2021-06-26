const path = require('path');
const pkg = require('../package.json');

const resolve = (_dir) => path.resolve(__dirname, '..', _dir);

module.exports = {
  isDevelopment: process.env.NODE_ENV === 'development',
  cacheDirectory: (_p) => !module.exports.isDevelopment && path.resolve(__dirname, '../node_modules/.cache', pkg.name, _p),
  dev: {
    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      context: ['/live-api', '/live-passport-api', '/sports-api', '/data-collection'],
      target: 'http://gw.uqiu.com',
      // target: 'http://192.168.100.130:12000',
      changeOrigin: true
      // pathRewrite: { '^/(live-api|live-passport-api|sports-api)': '' }
    },

    // Various Dev Server settings
    port: (process.env.PORT && Number(process.env.PORT)) || 7001,
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

    // Use Eslint Loader?
    // If true, your code will be linted during bundling and
    // linting errors and warnings will be shown in the console.
    useEslint: false,
    // If true, eslint errors and warnings will also be shown in the error overlay
    // in the browser.
    showEslintErrorsInOverlay: false,

    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    cssSourceMap: true
  },

  build: {
    // Template for index.html
    index: resolve('dist/index.html'),

    // Paths
    assetsRoot: resolve('dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',

    /**
     * Source Maps
     */

    productionSourceMap: false,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: false,

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report,
    // 打包成zip
    // `npm run build --zip`
    packagedIntoZip: process.env.npm_config_zip
  }
};
