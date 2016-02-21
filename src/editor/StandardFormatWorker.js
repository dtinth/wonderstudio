
import formatterCode from '!!raw!../../shim/standard-format/standard-format.browser'

eval(formatterCode) // eslint-disable-line

global.onmessage = e => {
  let code = null
  let error = null
  try {
    code = global.require('standard-format').transform(e.data.code)
  } catch (e) {
    if (e.index != null && e.lineNumber != null && e.column != null && e.description != null) {
      error = {
        index: e.index,
        lineNumber: e.lineNumber,
        column: e.column,
        description: e.description
      }
    }
  }
  global.postMessage({
    sequence: e.data.sequence,
    code: code,
    error: error
  })
}
