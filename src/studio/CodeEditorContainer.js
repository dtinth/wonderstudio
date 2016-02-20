import React from 'react'
import reproxy from '../reproxy'
import CodeEditorProxy from 'react-proxy?name=CodeEditor!../editor/CodeEditor'

const CodeEditorLoading = () => <div>
  (loading code editor!)
</div>

export default reproxy(CodeEditorProxy, CodeEditorLoading)
