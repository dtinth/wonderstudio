
import { findIndex, includes, without } from 'lodash'
import u from 'updeep'
import * as Components from '../app/Components'
import { getUIComponentNames } from '../app/Utils'
import { getComponentInitialProps } from '../app/AppState'

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

export const removeComponent = (component) => state => {
  const groups = state.ui
  const groupContainsComponent = group => includes(group.components, component)
  const originalGroupIndex = findIndex(groups, groupContainsComponent)
  if (originalGroupIndex === -1) return state
  const originalGroup = groups[originalGroupIndex]
  if (originalGroup.components.length !== 1) {
    return state // unsupported yet
  }
  const newGroups = [
    ...without(groups.slice(0, originalGroupIndex), originalGroup),
    ...without(groups.slice(originalGroupIndex + 1), originalGroup)
  ]
  return u({ ui: () => newGroups })(state)
}

const updateComponentById = (id, update) => u({
  ui: u.map({
    components: u.map(u.if(({ _id }) => _id === id, update))
  })
})

export const renameComponent = (component, name) => (
  updateComponentById(component._id, {
    name: name
  })
)

export const addNewComponent = (id, componentType) => {
  const newNameGivenExistingNames = existingNames => {
    const prefix = componentType.substr(0, 1).toLowerCase() + componentType.substr(1)
    for (let i = 1; ; i++) {
      const name = prefix + i
      if (!includes(existingNames, name)) return name
    }
  }
  const newComponentGivenExistingNames = existingNames => {
    const data = {
      _id: id,
      type: componentType,
      name: newNameGivenExistingNames(existingNames),
      props: { }
    }
    return { ...data, props: getComponentInitialProps(data) }
  }
  const newGroupForNewComponentGivenExistingNames = existingNames => ({
    components: [ newComponentGivenExistingNames(existingNames) ]
  })
  const append = groups => [
    ...groups,
    newGroupForNewComponentGivenExistingNames(getUIComponentNames(groups))
  ]
  return u({
    ui: append
  })
}

export const setComponentProperty = (component, name, value) => (
  updateComponentById(component._id, component => {
    const propertyDescriptors = Components[component.type].metadata.properties
    const descriptor = propertyDescriptors[name]
    return u({ props: descriptor.set(value) })(component)
  })
)

export const changeCode = code => u({ code: () => code })

export const getComponentById = (id) => state => {
  for (const group of state.ui) for (const component of group.components) {
    if (component._id === id) return component
  }
  return null
}
