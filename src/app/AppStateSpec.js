
import { createStoreForCode } from './AppState'

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
