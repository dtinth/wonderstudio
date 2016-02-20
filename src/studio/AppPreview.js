import React from 'react'
import styles from './AppPreview.styl'
import * as Components from '../app/Components'

export default React.createClass({
  propTypes: {
    app: React.PropTypes.object
  },
  renderComponent (component) {
    return <div className={styles.group}>
      <div className={styles.groupLabel}>
        {component.name}
      </div>
      <div className={styles.groupContent}>
        {this.renderWidget(component)}
      </div>
    </div>
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
      <div className={styles.content}>
        <div className={styles.backdrop}></div>
        {this.props.app.components.map(this.renderComponent)}
        <div className={styles.group}>
          <div className={styles.groupContent}>
            <div className={styles.newControl}>
              <button>add a new control</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  }
})
