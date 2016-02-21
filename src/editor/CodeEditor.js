import React from 'react'
import CodeMirror from 'codemirror'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/lib/codemirror.css'
import styles from './CodeEditor.styl'
import StandardFormatWorker from 'worker?name=StandardFormatWorker.js!./StandardFormatWorker'
import { Observable, CompositeDisposable, ReplaySubject } from 'rx'

export default React.createClass({
  propTypes: {
    code: React.PropTypes.string
  },
  componentDidMount () {
    this._disposables = new CompositeDisposable()
    this._props川 = new ReplaySubject(1)
    this._props川.onNext(this.props)
    this._tern川 = new ReplaySubject(1)

    const cm = this._cm = new CodeMirror(this._editorContainer, {
      value: this.props.code,
      mode: 'javascript',
      lineNumbers: true,
      viewportMargin: Infinity
    })

    // tern
    require.ensure([ ], () => {
      this._tern = require('./installTern')(cm)
      this._tern川.onNext(this._tern)
      const ternDefs = require('../app/ternDefs')
      this._tern.server.addDefs(ternDefs)
    }, 'tern')

    // tern completions
    {
      const initCode川 = this._props川.map(props => props.initCode).distinctUntilChanged()
      const action川 = Observable.combineLatest(this._tern川, initCode川,
        (tern, initCode) => () => tern.server.addFile('init.js', initCode)
      )
      this._disposables.add(action川.subscribe(f => f()))
    }

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
  componentWillReceiveProps (nextProps) {
    this._props川.onNext(nextProps)
  },
  componentWillUnmount () {
    this._disposables.dispose()
  },
  render () {
    return <div className={styles.root}>
      <div className={styles.editor} ref={element => this._editorContainer = element}>
      </div>
    </div>
  }
})
