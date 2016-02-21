import React from 'react'
import styles from './AppViewer.styl'
import Widget from './Widget'
import WidgetGroup from './WidgetGroup'

export default React.createClass({
  propTypes: {
    ui: React.PropTypes.array,
    dispatch: React.PropTypes.func
  },
  renderWidget (component, index) {
    return <Widget component={component} key={index} dispatch={this.props.dispatch} />
  },
  renderWidgetGroup (group, index) {
    return <WidgetGroup key={index}>
      {group.components.map(this.renderWidget)}
    </WidgetGroup>
  },
  render () {
    const ui = this.props.ui
    return <div className={styles.root}>
      {ui.map(this.renderWidgetGroup)}
      <div className={styles.credit}>
        Powered by wonderful.software/studio
      </div>
    </div>
  }
})
