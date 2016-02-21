
import { compile } from './'

describe('compile', function () {
  const compileCode = code => compile({
    ui: [ ],
    code: code
  })
  const compileUI = ui => compile({
    ui: ui,
    code: ''
  })
  describe('compiled code', function () {
    const compiledApp = () => compileCode('var x=()=>{}')
    it('should compile app to `compiled` key', function () {
      const result = compiledApp()
      assert(result.compiled)
    })
    it('should convert ES6 code to ES5', function () {
      const result = compiledApp()
      assert(/function/.test(result.compiled.code))
    })
    it('should include source maps', function () {
      const result = compiledApp()
      assert(/sourceMap/.test(result.compiled.code))
    })
    it('should throw when source code is malformed', function () {
      assert.throws(() => compileCode('var'))
    })
    it('parse error should contain position', function () {
      assert.throws(
        () => compileCode('\n\nvar'),
        e => (e.loc.line === 3 && e.loc.column === 3)
      )
    })
  })
  describe('validation', function () {
    it('throws when component name clashes', function () {
      assert.throws(
        () => compileUI([
          { components: [ { name: 'wow', type: 'Button', props: { } } ] },
          { components: [ { name: 'wow', type: 'Label', props: { } } ] }
        ]),
        e => /same/.test(e.message) && /wow/.test(e.message)
      )
    })
  })
})
