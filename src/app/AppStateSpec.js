
import {
  createStoreForCode,
  createUIInitializationCode,
  createDenormalizedUIStateSelector,
  getComponentInitialProps
} from './AppState'

import { matches } from 'lodash'

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

describe('createDenormalizedUIStateSelector', function () {
  const normalizedUIState = {
    components: {
      1: {
        type: 'Button',
        props: { label: 'cool' }
      },
      2: {
        type: 'Button',
        props: { label: 'app' }
      },
      3: {
        type: 'Button',
        props: { label: 'pal' } // wanna use ‘bro’ — as in ‘cool story bro’ —
        //                         but to avoid conflict
        //                         http://alexjs.com/
      }
    },
    ui: [
      { components: [ '1' ] },
      { components: [ '2' ] },
      { components: [ '3' ] }
    ]
  }
  it('should denormalize the UI state into each group', function () {
    const selector = createDenormalizedUIStateSelector()
    const denormalizedUIState = selector(normalizedUIState)
    const expectedDenormalizedUIState = [
      { components: [
        {
          type: 'Button',
          props: { label: 'cool' }
        }
      ] },
      { components: [
        {
          type: 'Button',
          props: { label: 'app' }
        }
      ] },
      { components: [
        {
          type: 'Button',
          props: { label: 'pal' } // wanna use ‘bro’ — as in ‘cool story bro’ —
          //                         but to avoid conflict
          //                         http://alexjs.com/
        }
      ] }
    ]
    assert(matches(expectedDenormalizedUIState)(denormalizedUIState))
  })
  it('should memoize', function () {
    const selector = createDenormalizedUIStateSelector()
    assert(selector(normalizedUIState) === selector(normalizedUIState))
  })
  it('should inject _set key for setting prop', function () {
    const selector = createDenormalizedUIStateSelector()
    const ui = selector(normalizedUIState)
    assert(typeof ui[0].components[0]._set === 'function')

    let ok = false
    ui[0].components[0]._set('text', 'cool')({
      setComponentProperty: (id, name, value) => {
        assert(typeof id === 'string')
        assert(name === 'text')
        assert(value === 'cool')
        ok = true
      }
    })
    assert(ok, 'setComponentProperty must be called')
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

describe('getComponentInitialProps({ type, name, props })', function () {
  it('should return the initial props for component, barring any missing props', function () {
    const props = getComponentInitialProps({
      type: 'Button',
      name: 'button1',
      props: { }
    })
    assert(props.label === 'button1')
  })
})
