import React from 'react'
import styles from './AppViewer.styl'
import Widget from './Widget'
import WidgetGroup from './WidgetGroup'

export default React.createClass({
  propTypes: {
    ui: React.PropTypes.object,
    dispatch: React.PropTypes.func
  },
  renderWidget (component) {
    return <Widget component={component} dispatch={this.props.dispatch} />
  },
  renderWidgetGroup (group) {
    return <WidgetGroup>
      {group.components.map(this.renderWidget)}
    </WidgetGroup>
  },
  render () {
    const ui = this.props.ui
    return <div className={styles.root}>
      {ui.map(this.renderWidgetGroup)}
    </div>
  }
})
