import React from 'react'
import styles from './StudioApp.styl'
import AppPreview from './AppPreview'
import CodeEditorContainer from './CodeEditorContainer'
import MetaBar from './MetaBar'

import HTML5Backend from 'react-dnd-html5-backend'
import { DragDropContext } from 'react-dnd'
import { compose } from 'recompose'
import * as Studio from './Studio'
import { createSelector } from 'reselect'

export default compose(
  DragDropContext(HTML5Backend),
)(React.createClass({
  propTypes: {
    initializationData: React.PropTypes.object
  },
  getInitialState () {
    this.getStore = (() => {
      const selector = createSelector(
        component => this.state.state,
        state => ({
          state,
          dispatch: this.onDispatch,
          query: message => message(Studio)(state)
        })
      )
      return () => selector(this)
    })()
    return { state: Studio.getInitialState(this.props.initializationData) }
  },
  onDispatch (message) {
    this.setState({ state: message(Studio)(this.state.state) })
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
          <AppPreview {...this.getStore()} />
        </div>
        <div className={styles.right}>
          <div className={styles.metabar}>
            <MetaBar store={this.getStore()} />
          </div>
          <div className={styles.codeEditor}>
            <CodeEditorContainer
              code={this.state.state.app.code}
              onChange={code => this.onDispatch(studio =>
                studio.toApp(app => app.changeCode(code))
              )}
              ui={this.state.state.app.ui}
              disabled={this.getStore().query(studio => studio.isRunning())}
            />
          </div>
        </div>
      </div>
    </div>
  }
}))
