module.exports = {
  // Let nwb know this is a React app when generic build commands are used
  type: 'react-app',
  loaders: {
    'stylus-css': {
      query: {
        modules: true,
        localIdentName: '[name]の[local]／[hash:base64:7]',
        importLoaders: 2
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

// ヤバい！！！！
require('nwb/lib/createWebpackConfig').default = (original => {
  return function () {
    const result = original.apply(this, arguments)
    if (!result.module.noParse) result.module.noParse = [ ]
    result.module.noParse.push(/standard-format/)
    return result
  }
})(require('nwb/lib/createWebpackConfig').default)
