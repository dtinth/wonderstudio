module.exports = {
  // Let nwb know this is a React app when generic build commands are used
  type: 'react-app',
  loaders: {
    'stylus-css': {
      query: {
        modules: true,
        localIdentName: '[name]の[local]／[hash:base64:7]'
      }
    },
    extra: [
      {
        test: /\.yml$/,
        loaders: [ 'json-loader', 'yaml-loader' ]
      }
    ]
  },
  karma: {
    tests: 'tests/index.js',
    reporters: [ 'mocha', 'growl' ],
    plugins: [
      require('karma-growl-reporter')
    ]
  },
  babel: {
    plugins: [ require.resolve('babel-plugin-espower') ]
  }
}
