
import CodeMirror from 'codemirror'
import 'codemirror/addon/dialog/dialog'
import 'codemirror/addon/hint/show-hint'
import 'imports?tern=tern!codemirror/addon/tern/tern'

import 'codemirror/addon/dialog/dialog.css'
import 'codemirror/addon/hint/show-hint.css'
import 'codemirror/addon/tern/tern.css'

import es5 from 'tern/defs/ecma5.json'
import es6 from 'tern/defs/ecma6.json'
import ternConsole from './tern/defs/console.json'

module.exports = function (cm) {
  const tern = new CodeMirror.TernServer({ defs: [ es5, es6, ternConsole ] })
  cm.setOption('extraKeys', {
    'Ctrl-Space': cm => tern.complete(cm),
    'Ctrl-I': cm => tern.showType(cm),
    'Ctrl-O': cm => tern.showDocs(cm),
    'Alt-.': cm => tern.jumpToDef(cm),
    'Alt-,': cm => tern.jumpBack(cm),
    'Ctrl-Q': cm => tern.rename(cm),
    'Ctrl-.': cm => tern.selectName(cm)
  })
  cm.showHint = (original => function (options) {
    return original.call(this, { ...options, completeSingle: false })
  })(cm.showHint)
  cm.on('cursorActivity', cm => tern.updateArgHints(cm))
  cm.on('change', (instance, change) => {
    if (change.text.length === 1 && change.text[0] === '.') {
      tern.complete(cm)
    }
  })
  return tern
}
