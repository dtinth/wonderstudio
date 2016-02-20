
import { findIndex, includes, without } from 'lodash'
import u from 'updeep'

export const moveComponent = (component, position) => state => {
  const groups = state.ui
  const groupContainsComponent = group => includes(group.components, component)
  const originalGroupIndex = findIndex(groups, groupContainsComponent)
  if (originalGroupIndex === -1) return state
  const originalGroup = groups[originalGroupIndex]
  if (originalGroup.components.length !== 1) {
    return state // unsupported yet
  }
  if (typeof position === 'number') {
    const newGroups = [
      ...without(groups.slice(0, position), originalGroup),
      originalGroup,
      ...without(groups.slice(position), originalGroup)
    ]
    return u({ ui: () => newGroups })(state)
  } else {
    return state
  }
}

export const getComponentById = (id) => state => {
  for (const group of state.ui) for (const component of group.components) {
    if (component._id === id) return component
  }
  return null
}
