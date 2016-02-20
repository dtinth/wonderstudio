import React from 'react'
import styles from './CodeEditor.styl'
import 'codemirror/lib/codemirror.css'
import CodeMirror from 'codemirror'
import 'codemirror/mode/javascript/javascript'

export default React.createClass({
  propTypes: {
    code: React.PropTypes.string
  },
  componentDidMount () {
    this._editor = new CodeMirror(this._editorContainer, {
      value: this.props.code,
      mode: 'javascript',
      lineNumbers: true,
      viewportMargin: Infinity
    })
  },
  render () {
    return <div className={styles.root}>
      <div className={styles.editor} ref={element => this._editorContainer = element}>
      </div>
    </div>
  }
})
