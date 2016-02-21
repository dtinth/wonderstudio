import React from 'react'
import styles from './AppRunner.styl'
import Widget from './Widget'
import WidgetGroup from './WidgetGroup'
import { createUIInitializationCode, createStoreForCode } from './AppState'

/* eslint no-eval: 0 */
export default React.createClass({
  propTypes: {
    app: React.PropTypes.object
  },
  getInitialState () {
    const initializationCode = createUIInitializationCode(this.props.app.ui)
    const code = eval(
      '(function(runtime){"use strict";' +
        initializationCode + ';' +
        'eval(' + JSON.stringify(this.props.app.compiled.code) + ')' +
      '})'
    )
    this._store = createStoreForCode(code)
    return { storeState: this._store.getState() }
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
    return <Widget component={component} />
  },
  renderWidgetGroup (group) {
    return <WidgetGroup>
      {group.components.map(this.renderWidget)}
    </WidgetGroup>
  },
  render () {
    return <div className={styles.root}>
      {this.props.app.ui.map(this.renderWidgetGroup)}
    </div>
  }
})
