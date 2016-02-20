import React from 'react'
import CodeMirror from 'codemirror'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/lib/codemirror.css'
import styles from './CodeEditor.styl'

export default React.createClass({
  propTypes: {
    code: React.PropTypes.string
  },
  componentDidMount () {
    const cm = this._cm = new CodeMirror(this._editorContainer, {
      value: this.props.code,
      mode: 'javascript',
      lineNumbers: true,
      viewportMargin: Infinity
    })
    require.ensure([ ], () => {
      this._tern = require('./installTern')(cm)
      // this._tern.server.addFile('runtime.js', 'function wow() { return 42 };')
    }, 'tern')
  },
  render () {
    return <div className={styles.root}>
      <div className={styles.editor} ref={element => this._editorContainer = element}>
      </div>
    </div>
  }
})
