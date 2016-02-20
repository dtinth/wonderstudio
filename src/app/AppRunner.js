import React from 'react'
import styles from './AppRunner.styl'
import Widget from './Widget'
import WidgetGroup from './WidgetGroup'

export default React.createClass({
  propTypes: {
    app: React.PropTypes.object
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
