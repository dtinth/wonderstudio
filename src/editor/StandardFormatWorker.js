
import code from '!!raw!../../shim/standard-format/standard-format.browser'

eval(code) // eslint-disable-line

global.onmessage = e => {
  global.postMessage({
    sequence: e.data.sequence,
    code: global.require('standard-format').transform(e.data.code)
  })
}
