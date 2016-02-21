
import { transform } from 'babel-standalone'
import { chain } from 'lodash'
import u from 'updeep'

export function compile (app) {
  validateComponentNames(app)
  const compiledCode = transform(app.code, { presets: [ 'es2015' ], sourceMaps: 'inline' })
  return u({
    compiled: () => ({
      code: compiledCode.code
    })
  })(app)
}

function validateComponentNames (app) {
  const clashedNames = (chain(app.ui)
    .map(group => group.components.map(component => component.name))
    .flatten()
    .groupBy()
    .map((names, name) => [ name, names.length ])
    .filter(([ name, count ]) => count > 1)
    .map(([ name, count ]) => name)
    .sortBy()
    .value()
  )
  if (clashedNames.length > 0) {
    throw new Error('Multiple components with same name: ' + (clashedNames
      .map(name => `‘${name}’`)
      .join(', ')
    ))
  }
}
