
import { transform } from 'babel-standalone'
import u from 'updeep'

export function compile (app) {
  const compiledCode = transform(app.code, { presets: [ 'es2015' ], sourceMaps: 'inline' })
  return u({
    compiled: () => ({
      code: compiledCode.code
    })
  })(app)
}
