
import { createStoreForCode, createUIInitializationCode } from './AppState'

describe('createStoreForCode', function () {
  it('should emit UI state from imperative code', function () {
    const code = (runtime) => {
      // This code should be generated.
      const button1 = runtime.createButton({
        label: 'One'
      })
      runtime.appendGroup([ button1 ])

      // This code comes from user.
      button1.onclick = function () {
        button1.label += 'Two'
      }
    }
    const store = createStoreForCode(code)
    const getButton = () => {
      const state = store.getState()
      return state.components[state.ui[0].components[0]]
    }
    assert(getButton().props.label === 'One')
    getButton().props.onclick()
    assert(getButton().props.label === 'OneTwo')
  })
})

describe('createUIInitializationCode', function () {
  it('should generate code to initialize ui', function () {
    const ui = [
      { components: [
        { name: 'a', type: 'Button', props: { label: 'cool bro' } }
      ] }
    ]
    const code = createUIInitializationCode(ui)
    const calls = [ ]
    const runtime = {
      createButton (props) {
        calls.push({ method: 'createButton', props: props })
        return { _id: 'x' }
      },
      appendGroup (group) {
        calls.push({ method: 'appendGroup', group: group })
      }
    }
    void (0, eval)('(function(runtime) { eval(' + JSON.stringify(code) + ') })')(runtime) // eslint-disable-line
    console.log(code)
    console.log(calls)
    assert.deepEqual(calls, [
      { method: 'createButton', props: { label: 'cool bro' } },
      { method: 'appendGroup', group: [ { _id: 'x' } ] }
    ])
  })
})
