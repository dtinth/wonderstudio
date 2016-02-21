import React from 'react'
import styles from './AppRunner.styl'
import Widget from './Widget'
import WidgetGroup from './WidgetGroup'
import { createStoreForApp, createDenormalizedUIStateSelector } from './AppState'

export default React.createClass({
  propTypes: {
    app: React.PropTypes.object
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
  renderWidget (component) {
    return <Widget component={component} dispatch={this._store.dispatchMessage} />
  },
  renderWidgetGroup (group) {
    return <WidgetGroup>
      {group.components.map(this.renderWidget)}
    </WidgetGroup>
  },
  render () {
    const ui = this.getUIState()
    return <div className={styles.root}>
      {ui.map(this.renderWidgetGroup)}
    </div>
  }
})
