module.exports = {
  presets: ['react-app'],
  plugins: [
    '@babel/plugin-proposal-throw-expressions',
    './build/babel-plugin/auto-css-modules',
    ['import', {
      libraryName: 'lodash',
      libraryDirectory: '',
      camel2DashComponentName: false
    }, 'lodash'],
    ['import', {
      libraryName: '@material-ui/core',
      libraryDirectory: 'components',
      camel2DashComponentName: false
    }, '@material-ui/core'],
    ['import', {
      libraryName: 'iview',
      libraryDirectory: 'src/components',
      camel2DashComponentName: true
    }, 'iview']
  ]
};
