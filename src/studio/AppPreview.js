import React from 'react'
import styles from './AppPreview.styl'

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
        (render component here)
      </div>
    </div>
  },
  render () {
    return <div className={styles.root}>
      <div className={styles.backdrop}></div>
      {this.props.app.components.map(this.renderComponent)}
    </div>
  }
})
