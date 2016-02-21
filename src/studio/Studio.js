
import * as App from './App'
import u from 'updeep'
import testApp from '../example-apps/welcome.yml'

export const getInitialState = () => ({ app: testApp, running: false })

export const isRunning = () => state => !!state.running
export const startRunning = compiledApp => u({ running: () => compiledApp })
export const stopRunning = () => u({ running: false })
export const getRunningCompiledApp = () => state => state.running

export const moveComponent = (component, position) => toApp(
  app => app.moveComponent(component, position)
)
export const selectComponent = (component) => u({
  selectedComponentId: id => id === component._id ? null : component._id
})

export const toApp = (message) => u({ app: app => message(App)(app) })

export const unselectComponent = () => u({
  selectedComponentId: null
})

export const getSelectedComponent = () => (state) => (
  App.getComponentById(state.selectedComponentId)(state.app)
)
