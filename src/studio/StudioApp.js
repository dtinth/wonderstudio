import React from 'react'
import styles from './StudioApp.styl'

export default React.createClass({
  render () {
    return <div className={styles.root}>
      <div className={styles.title}>
        <div className={styles.appTitle}>
          <em>wonderful.software</em><span>/</span><strong>studio</strong>
        </div>
      </div>
      <h2>Welcome to React WOW COOL GR8 job</h2>
    </div>
  }
})
