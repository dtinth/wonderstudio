
import { chain } from 'lodash'

export function getUIComponentNames (ui) {
  return (chain(ui)
    .map(group => group.components.map(component => component.name))
    .flatten()
    .value()
  )
}
