
import { chain } from 'lodash'

export function getUIComponentNames (ui) {
  return (chain(ui)
    .map(group => group.components.map(component => component.name))
    .flatten()
    .value()
  )
}

export function inferApplicationName ({ app }) {
  if (app && app.ui) {
    for (const group of app.ui) {
      for (const component of group.components) {
        if (component.type === 'AppBar' && component.props.title) {
          return component.props.title
        }
      }
    }
  }
  return 'Untitled App'
}
