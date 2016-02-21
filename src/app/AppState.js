
import { createStore } from 'redux'
import u from 'updeep'
import * as Components from './Components'

const INITIAL_STATE = {
  ui: [ ],
  components: { }
}

const appDomain = {
  createComponent: (id, type, props) => u({
    components: {
      [id]: () => ({ type, props })
    }
  }),
  appendGroup: (ids) => u({
    ui: (state) => [ ...state, { components: ids } ]
  }),
  setComponentProperty: (id, name, value) => u({
    components: {
      [id]: component => u({
        props: props => Components[component.type].metadata.properties[name].set(value)(props)
      })(component)
    }
  }),
  getComponentProperty: (id, name) => state => {
    const component = state.components[id]
    return Components[component.type].metadata.properties[name].get(component.props)
  }
}

function createRuntime (dispatch, query) {
  let _nextId = 1
  const nextId = () => _nextId++
  const runtime = {
    appendGroup (controls) {
      dispatch(app => app.appendGroup(controls.map(control => control._id)))
    }
  }
  for (const componentName of Object.keys(Components)) {
    const Component = Components[componentName]
    if (Component.metadata) {
      runtime[`create${componentName}`] = createRemote(componentName)
    }
  }
  return runtime
  function createRemote (componentName) {
    return function (props) {
      const id = nextId()
      dispatch(app => app.createComponent(id, componentName, props))
      const remote = { _id: id }
      const properties = Components[componentName].metadata.properties
      for (const property of Object.keys(properties)) {
        Object.defineProperty(remote, property, {
          enumerable: true,
          get: () => query(app => app.getComponentProperty(id, property)),
          set: value => dispatch(app => app.setComponentProperty(id, property, value))
        })
      }
      return remote
    }
  }
}

function reducer (state = INITIAL_STATE, action) {
  return (typeof action.message === 'function'
    ? action.message(appDomain)(state)
    : state
  )
}

export function createStoreForCode (code) {
  const store = createStore(reducer)
  const query = getSelector => getSelector(appDomain)(store.getState())
  const dispatch = message => store.dispatch({ type: 'MESSAGE', message })
  code(createRuntime(dispatch, query))
  return store
}

export function createUIInitializationCode (ui) {
  const statements = [ 'var ui = { }' ]
  const ref = name => 'ui[' + JSON.stringify(name) + ']'
  for (const group of ui) {
    const names = [ ]
    for (const component of group.components) {
      statements.push(ref(component.name) + ' = runtime.create' + component.type + '(' + JSON.stringify(component.props) + ')')
      names.push(component.name)
    }
    statements.push('runtime.appendGroup([ ' + names.map(ref).join(', ') + ' ])')
  }
  return statements.join(';\n') + ';'
}
