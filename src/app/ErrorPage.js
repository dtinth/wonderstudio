
import styles from './ErrorPage.styl'
import React from 'react'

export default React.createClass({
  propTypes: {
    error: React.PropTypes.object
  },
  render () {
    return <div className={styles.root}>
      <h1>Error! {this.props.error.title || ''}</h1>
      <p>
        {this.props.error.message || 'That’s all I know. Sorry!'}
      </p>
    </div>
  }
})
