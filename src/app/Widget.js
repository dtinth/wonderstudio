
import React from 'react'
import * as Components from './Components'
import styles from './Widget.styl'

export default React.createClass({
  propTypes: {
    component: React.PropTypes.object
  },
  render () {
    const component = this.props.component
    const Component = Components[component.type]
    if (Component) {
      return <div className={styles.root}>
        <Component {...component.props} />
      </div>
    } else {
      return <div className={styles.error}>Unknown component: <strong>{component.type}</strong></div>
    }
  }
})
