
import { createStore } from 'redux'
import u from 'updeep'

const INITIAL_STATE = {
  ui: [ ],
  components: { }
}

const controls = {
  Button: {
    setLabel: value => u({ label: () => value }),
    setOnclick: value => u({ onclick: () => value })
  }
}

const app = {
  createControl: (id, type, props) => u({
    components: {
      [id]: () => ({ type, props })
    }
  }),
  appendGroup: (ids) => u({
    ui: (state) => [ ...state, { components: ids } ]
  }),
  dispatchToComponent: (id, message) => u({
    components: {
      [id]: control => u({
        props: props => message(controls[control.type])(props)
      })(control)
    }
  })
}

const UI = {
  Button: (id, dispatch, getState) => {
    return {
      _id: id,
      get label () {
        return getState().props.label
      },
      set label (value) {
        return dispatch(button => button.setLabel(value))
      },
      get onclick () {
        return getState().props.onclick
      },
      set onclick (value) {
        return dispatch(button => button.setOnclick(value))
      }
    }
  }
}

function createRuntime (dispatch, getState) {
  let _nextId = 1
  const nextId = () => _nextId++
  return {
    createButton (props) {
      const id = nextId()
      dispatch(app => app.createControl(id, 'Button', props))
      const childDispatch = message => dispatch(app => app.dispatchToComponent(id, message))
      const getChildState = () => getState().components[id]
      return new UI.Button(id, childDispatch, getChildState)
    },
    appendGroup (controls) {
      dispatch(app => app.appendGroup(controls.map(control => control._id)))
    }
  }
}

function reducer (state = INITIAL_STATE, action) {
  return (typeof action.message === 'function'
    ? action.message(app)(state)
    : state
  )
}

export function createStoreForCode (code) {
  const store = createStore(reducer)
  const getState = () => store.getState()
  const dispatch = message => store.dispatch({ type: 'MESSAGE', message })
  code(createRuntime(dispatch, getState))
  return store
}
