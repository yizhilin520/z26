const rm = require('rimraf');
const chalk = require('chalk');
const webpack = require('webpack');
const config = require('./config');
const webpackConfig = require('./webpack.prod.config');

rm(config.build.assetsRoot, (err) => {
  if (err) throw err;
  webpack(webpackConfig, (e, stats) => {
    if (e) throw e;
    process.stdout.write(`${stats.toString({
      entrypoints: false,
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    })}\n\n`);

    if (stats.hasErrors()) {
      console.log(chalk.red('  Build failed with errors.\n'));
      process.exit(1);
    }

    console.log(chalk.cyan('  Build complete.\n'));
    console.log(chalk.yellow(
      '  Tip: built files are meant to be served over an HTTP server.\n'
      + '  Opening index.html over file:// won\'t work.\n'
    ));
  });
});
