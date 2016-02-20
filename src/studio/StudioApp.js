import React from 'react'
import styles from './StudioApp.styl'
import AppPreview from './AppPreview'
import testApp from '../example-apps/adder.yml'

export default React.createClass({
  render () {
    return <div className={styles.root}>
      <div className={styles.title}>
        <div className={styles.appTitle}>
          <em>wonderful.software</em><span>/</span><strong>studio</strong>
        </div>
      </div>
      <div className={styles.middle}>
        <div className={styles.left}>
          <AppPreview app={testApp} />
        </div>
        <div className={styles.right}>
        </div>
      </div>
    </div>
  }
})
