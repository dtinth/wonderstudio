import React from 'react'
import CodeMirror from 'codemirror'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/lib/codemirror.css'
import styles from './CodeEditor.styl'
import StandardFormatWorker from 'worker?name=StandardFormatWorker.js!./StandardFormatWorker'

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
      const ternDefs = require('../app/ternDefs')
      this._tern.server.addDefs(ternDefs)
    }, 'tern')

    // standard-format
    {
      let seq = 1
      const worker = new StandardFormatWorker()
      cm.on('blur', function () {
        seq += 1
        const code = cm.getValue()
        const sequence = seq
        worker.postMessage({ sequence, code })
      })
      cm.on('focus', function () {
        seq += 1
      })
      worker.onmessage = e => {
        if (e.data.sequence === seq) {
          cm.setValue(e.data.code)
        }
      }
    }

    // Babel integration
    // XXX: probably should move this somewhere else
    require.ensure([ ], () => {
    }, 'babel-standalone')
  },
  render () {
    return <div className={styles.root}>
      <div className={styles.editor} ref={element => this._editorContainer = element}>
      </div>
    </div>
  }
})
