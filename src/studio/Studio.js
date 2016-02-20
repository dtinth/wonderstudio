
import * as App from './App'
import u from 'updeep'
import testApp from '../example-apps/welcome.yml'

export const getInitialState = () => ({ app: testApp })

export const moveComponent = (component, position) => u({
  app: App.moveComponent(component, position)
})

export const selectComponent = (component) => u({
  selectedComponentId: component._id
})

export const getSelectedComponent = () => (state) => (
  App.getComponentById(state.selectedComponentId)(state.app)
)
