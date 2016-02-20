
import ternDefs from './ternDefs'

describe('ternDefs', function () {
  it('should describe the property', function () {
    assert(ternDefs['!define'].buttonProps.label['!type'] === 'string')
  })
  it('should document the property', function () {
    assert(/text/i.test(ternDefs['!define'].buttonProps.label['!doc']))
  })
  it('should define an instance type', function () {
    assert(ternDefs['!define'].Button.prototype['!proto'] === 'buttonProps')
  })
  it('should add function to runtime', function () {
    assert(ternDefs.runtime.createButton['!type'] === 'fn(props: buttonProps) -> +Button')
  })
})
