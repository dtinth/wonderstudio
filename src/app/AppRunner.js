import React from 'react'
import { createStoreForApp, createDenormalizedUIStateSelector } from './AppState'

export default React.createClass({
  propTypes: {
    app: React.PropTypes.object,
    component: React.PropTypes.func
  },
  getInitialState () {
    this._store = createStoreForApp(this.props.app)
    this._uiStateSelector = createDenormalizedUIStateSelector()
    return { storeState: this._store.getState() }
  },
  getUIState () {
    return this._uiStateSelector(this.state.storeState)
  },
  componentDidMount () {
    this._unsubscribe = this._store.subscribe(() => this.setState({
      storeState: this._store.getState()
    }))
  },
  componentWillUnmount () {
    this._unsubscribe()
  },
  render () {
    const ui = this.getUIState()
    const Component = this.props.component
    return <Component ui={ui} dispatch={this._store.dispatchMessage} />
  }
})
