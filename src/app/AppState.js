
import { createStore } from 'redux'
import u from 'updeep'
import * as Components from './Components'
import { createSelector } from 'reselect'
import { mapValues, defaults, memoize } from 'lodash'

const INITIAL_STATE = {
  ui: [ ],
  components: { }
}

const appDomain = {
  createComponent: (id, type, props) => u({
    // Situation: Components created inside imperative code may not be added
    //            to the UI just yet. That’s why we need to store them out of
    //            the `ui` subtree.
    //
    // But this seems like a memory leak...
    // But who cares during a hackathon?
    // Just make it work already!
    //
    // Perhaps we can refactor this and denormalize the component information
    // directly inside the UI and use some kind of ID to keep track of them.
    //
    // You know, later.
    //
    components: {
      [id]: () => ({ type, props: getComponentInitialProps({ type, props }) })
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

  // HACK: expose `dispatchMessage` so it can be reused in UI
  store.dispatchMessage = dispatch
  return store
}

export function createUIInitializationCode (ui) {
  // WTF: This code is soooooo imperative.
  //      This can serve as a good example for imperative code vs functional code.
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

export function createDenormalizedUIStateSelector () {
  const injectActionCreator = memoize(id => createSelector(
    componentProps => componentProps,
    componentProps => Object.assign({ }, componentProps, {
      _set: (name, value) => app => app.setComponentProperty(id, name, value)
    })
  ))
  const denormalizeComponent = state => id => injectActionCreator(id)(state.components[id])
  const denormalizeGroup = state => u({ components: u.map(denormalizeComponent(state)) })
  return createSelector(
    state => state,
    state => state.ui.map(denormalizeGroup(state))
  )
}

/* eslint no-eval: 0 */
export function createStoreForApp (app) {
  const initializationCode = createUIInitializationCode(app.ui)
  const code = eval(
    '(function(runtime) {' +
      '"use strict";' +
      initializationCode + ';' +
      'eval(' + JSON.stringify(app.compiled.code) + ')' +
    '})'
  )
  return createStoreForCode(code)
}

export function getComponentInitialProps ({ type, name, props = { } }) {
  const propDescriptors = Components[type].metadata.properties
  const defaultProps = mapValues(propDescriptors,
    descriptor => descriptor.default({ type, name })
  )
  return defaults({ }, props, defaultProps)
}
