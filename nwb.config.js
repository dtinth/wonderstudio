'use strict'

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
const ride = require('ride')
const u = require('updeep').default

ride(require('nwb/lib/createWebpackConfig'), 'default', original => {
  return function () {
    const result = original.apply(this, arguments)
    if (!result.module.noParse) result.module.noParse = [ ]
    result.module.noParse.push(/standard-format/)
    if (result.output) {
      result.output.chunkFilename = '[name]-[chunkhash].js'
    }
    for (const plugin of Array.from(result.plugins)) {
      if (plugin.constructor.name.match(/ExtractText/)) {
        console.error('Hack: Extracting CSS from all chunks!')
        plugin.options.allChunks = true
      }
    }
    // const removeExtract = u.if(
    //   spec => spec.loader, {
    //     loader: l => l.replace(/^.*?extract-text[^!]*!/, 'style!')
    //   }
    // )
    // return u({
    //   module: {
    //     loaders: u.map(removeExtract)
    //   }
    // })(result)
    return result
  }
})
