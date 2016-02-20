import React from 'react'
import styles from './AppRunner.styl'
import * as Components from './Components'

export default React.createClass({
  propTypes: {
    app: React.PropTypes.object
  },
  renderWidget (component) {
    const Component = Components[component.type]
    if (Component) {
      return <div className={styles.widget}>
        <Component {...component.props} />
      </div>
    } else {
      return <div>Unknown component: <strong>{component.type}</strong></div>
    }
  },
  render () {
    return <div className={styles.root}>
      {this.props.app.components.map(this.renderWidget)}
    </div>
  }
})
