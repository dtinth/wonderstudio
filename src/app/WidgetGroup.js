
import React from 'react'
import styles from './WidgetGroup.styl'

export default React.createClass({
  propTypes: {
    children: React.PropTypes.node
  },
  render () {
    return <div className={styles.root}>{this.props.children}</div>
  }
})
