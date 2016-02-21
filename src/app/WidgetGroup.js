
import React from 'react'
import styles from './WidgetGroup.styl'
import { pure } from 'recompose'

export default pure(React.createClass({
  propTypes: {
    children: React.PropTypes.node
  },
  render () {
    return <div className={styles.root}>{this.props.children}</div>
  }
}))
