import React from 'react'
import CodeMirror from 'codemirror'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/lib/codemirror.css'
import styles from './CodeEditor.styl'
import StandardFormatWorker from 'worker?name=StandardFormatWorker.js!./StandardFormatWorker'
import { Observable, CompositeDisposable, ReplaySubject, Subject } from 'rx'
import classNames from 'classnames'

const Atom = () => {
  let cur = null
  return {
    swap (behave) {
      try {
        if (cur) cur()
      } finally {
        cur = null
        cur = behave()
      }
    }
  }
}

export default React.createClass({
  propTypes: {
    code: React.PropTypes.string,
    disabled: React.PropTypes.bool,
    onChange: React.PropTypes.func
  },
  componentDidMount () {
    const disposables = this._disposables = new CompositeDisposable()
    const props川 = this._props川 = new ReplaySubject(1)
    this._props川.onNext(this.props)
    this._tern川 = new ReplaySubject(1)

    const cm = this._cm = new CodeMirror(this._editorContainer, {
      value: this.props.code,
      mode: 'javascript',
      lineNumbers: true,
      viewportMargin: Infinity
    })

    // enabled/disabled
    {
      const disabled川 = props川.map(props => props.disabled).distinctUntilChanged()
      disposables.add(disabled川.subscribe(disabled => cm.setOption('readOnly', disabled)))
    }

    // tern
    require.ensure([ ], () => {
      this._tern = require('./installTern')(cm)
      this._tern川.onNext(this._tern)
      const ternDefs = require('../app/ternDefs')
      this._tern.server.addDefs(ternDefs)
    }, 'tern')

    // tern completions
    {
      const initCode川 = props川.map(props => props.initCode).distinctUntilChanged()
      const action川 = Observable.combineLatest(this._tern川, initCode川,
        (tern, initCode) => () => tern.server.addFile('init.js', initCode)
      )
      disposables.add(action川.subscribe(f => f()))
    }

    // error line highlight
    const highlightErrorLine = (() => {
      const atom = new Atom()
      cm.on('change', () => atom.swap(() => { }))
      return lineNumber => {
        atom.swap(() => (
          cm.getDoc().addLineClass(lineNumber, 'background', 'CodeEditor-error'),
          () => cm.getDoc().removeLineClass(lineNumber, 'background', 'CodeEditor-error')
        ))
      }
    })()

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
          if (e.data.code) {
            cm.setValue(e.data.code)
          } else if (e.data.error) {
            if (/Unexpected end of input/.test(e.data.error.description)) {
              window.alert('Syntax Error:\nThere’s an unclosed block, parenthesis, or string.')
            } else {
              window.alert('Syntax Error:\n' + e.data.error.description + '\n\nLine: ' + e.data.error.lineNumber)
              highlightErrorLine(e.data.error.lineNumber - 1)
            }
            cm.focus()
          }
        }
      }
    }

    // Babel integration
    // XXX: probably should move this somewhere else
    require.ensure([ ], () => {
    }, 'babel-standalone')

    // notifications
    {
      const changes川 = new Subject()
      cm.on('change', () => {
        changes川.onNext(cm.getValue())
      })
      disposables.add(changes川.debounce(138).subscribe(value => {
        if (this.props.onChange) this.props.onChange(value)
      }))
    }
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
      <div className={classNames(styles.cover, {
        [styles.isVisible]: this.props.disabled
      })}></div>
    </div>
  }
})
