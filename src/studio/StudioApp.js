import React from 'react'
import styles from './StudioApp.styl'
import AppPreview from './AppPreview'
import testApp from '../example-apps/welcome.yml'
import CodeEditorContainer from './CodeEditorContainer'

import HTML5Backend from 'react-dnd-html5-backend'
import { DragDropContext } from 'react-dnd'
import { withState, compose } from 'recompose'
import * as Studio from './Studio'

export default compose(
  DragDropContext(HTML5Backend),
  withState('app', 'onUpdateApp', testApp)
)(React.createClass({
  propTypes: {
    app: React.PropTypes.object,
    onUpdateApp: React.PropTypes.func
  },
  onDispatch (message) {
    this.props.onUpdateApp(message(Studio))
  },
  render () {
    return <div className={styles.root}>
      <div className={styles.title}>
        <div className={styles.appTitle}>
          <em>wonderful.software</em><span>/</span><strong>studio</strong>
        </div>
      </div>
      <div className={styles.middle}>
        <div className={styles.left}>
          <AppPreview app={this.props.app} onDispatch={this.onDispatch} />
        </div>
        <div className={styles.right}>
          <CodeEditorContainer code={testApp.code} />
        </div>
      </div>
    </div>
  }
}))
