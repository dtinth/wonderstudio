
import reproxy from '../reproxy'
import CodeEditorProxy from 'react-proxy?name=CodeEditor!../editor/CodeEditor'
import CodeEditorLoading from './CodeEditorLoading'

export default reproxy(CodeEditorProxy, CodeEditorLoading)
