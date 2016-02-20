
global.assert = require('power-assert')

const context = require.context('../src', true, /Spec\.js$/)
console.log(context.keys())
context.keys().forEach(context)
