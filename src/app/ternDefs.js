
import * as Components from './Components'
import { forOwn, mapValues } from 'lodash'

const ternDefs = {
  '!define': { },
  runtime: { }
}

const down = s => s.substr(0, 1).toLowerCase() + s.substr(1)
forOwn(Components, (Component, componentName) => {
  const propertyDescriptors = Component.metadata.properties
  const propsTypeName = down(componentName) + 'Props'
  ternDefs['!define'][propsTypeName] = mapValues(propertyDescriptors,
    (descriptor, propertyName) => {
      return {
        '!type': descriptor.type,
        '!doc': descriptor.doc
      }
    }
  )
  ternDefs['!define'][componentName] = {
    prototype: { '!proto': propsTypeName }
  }
  ternDefs.runtime['create' + componentName] = {
    '!type': `fn(props: ${propsTypeName}) -> +${componentName}`,
    '!doc': `Creates a new ${componentName} (but does not add it to the user interface)`
  }
})

export default ternDefs
