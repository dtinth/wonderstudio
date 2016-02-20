import React from 'react'
import styles from './StudioApp.styl'
import AppPreview from './AppPreview'
import testApp from '../example-apps/welcome.yml'
import CodeEditorContainer from './CodeEditorContainer'

import HTML5Backend from 'react-dnd-html5-backend'
import { DragDropContext } from 'react-dnd'

const StudioApp = React.createClass({
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
          <CodeEditorContainer code={testApp.code} />
        </div>
      </div>
    </div>
  }
})

export default DragDropContext(HTML5Backend)(StudioApp)
