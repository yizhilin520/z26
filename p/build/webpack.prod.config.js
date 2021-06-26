/**
 * @intro: webpack配置生产.
 */
const path = require('path');
const utils = require('./utils');
const merge = require('webpack-merge').default;
const CopyWebpackPlugin = require('copy-webpack-plugin');
const DotEnvWebpackPlugin = require('dotenv-webpack');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const SriPlugin = require('webpack-subresource-integrity');
const ZipPlugin = require('zip-webpack-plugin');
const webpackBaseConfig = require('./webpack.base.config');
const config = require('./config');
const pkg = require('../package.json');

const resolve = (dir) => path.join(__dirname, '..', dir);

const mode = process.env.NODE_MODE || process.env.NODE_ENV;

module.exports = merge(webpackBaseConfig, {
  mode: 'production',
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.build.productionSourceMap,
      extract: true,
      usePostCSS: true
    })
  },
  devtool: config.build.productionSourceMap ? config.build.devtool : false,
  output: {
    path: config.build.assetsRoot,
    publicPath: config.build.assetsPublicPath,
    filename: utils.assetsFilenames.app,
    chunkFilename: utils.assetsFilenames.chunk,
    crossOriginLoading: 'anonymous'
  },
  plugins: [
    new SriPlugin({
      hashFuncNames: ['sha256']
    }),
    new DotEnvWebpackPlugin({
      path: `.env.${mode}`,
      silent: true, // hide any errors
      systemvars: true,
      defaults: '.env'
    }),
    new MiniCssExtractPlugin({
      filename: utils.assetsFilenames.css,
      chunkFilename: utils.assetsFilenames.css,
      ignoreOrder: true
    }),
    // see https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: config.build.index,
      template: 'index.ejs',
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      },
      favicon: 'favicon.ico'
    }),
    // copy custom static assets
    new CopyWebpackPlugin([{
      from: path.resolve(__dirname, '../static'),
      to: config.dev.assetsSubDirectory,
      ignore: ['.*']
    }]),
    // https://github.com/erikdesjardins/zip-webpack-plugin
    config.build.packagedIntoZip && new ZipPlugin({
      filename: `${pkg.name}_v${pkg.version}.zip`
    })
  ].filter(Boolean),
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          name: 'vendor',
          chunks: 'initial',
          test: ({ resource }) => resource && /\.js$/.test(resource) && resource.indexOf(resolve('node_modules')) === 0
        },
        async: {
          name: 'async',
          chunks: 'async',
          minChunks: 3
        }
      }
    },
    runtimeChunk: true,
    minimizer: [
      new OptimizeCSSPlugin({
        cssProcessorOptions: config.build.productionSourceMap
          ? {
            safe: true,
            map: { inline: false }
          }
          : { safe: true }
      }),
      new UglifyJsPlugin({
        cache: config.cacheDirectory('uglifyjs'),
        uglifyOptions: {
          output: {
            comments: false
          },
          compress: {
            drop_debugger: true,
            drop_console: true
          }
        },
        sourceMap: false,
        parallel: true
      })
    ]
  }
});
