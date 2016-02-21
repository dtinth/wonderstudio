
import reproxy from '../reproxy'
import CodeEditorProxy from 'react-proxy?name=CodeEditor!../editor/CodeEditor'
import CodeEditorLoading from './CodeEditorLoading'
import { mapPropsOnChange, compose } from 'recompose'
import { createUIInitializationCode } from '../app/AppState'

export default compose(
  mapPropsOnChange([ 'ui' ],
    ({ ui }) => ({
      initCode: createUIInitializationCode(ui)
    })
  )
)(reproxy(CodeEditorProxy, CodeEditorLoading))
