
import * as Studio from './Studio'

describe('moveComponent(component, dropTarget)', function () {
  const A = { name: 'A' }
  const B = { name: 'B' }
  const C = { name: 'C' }
  const D = { name: 'D' }

  function stateForComponents (groups) {
    return {
      ui: groups.map(components => ({ components }))
    }
  }

  it('should move component to the correct position', function () {
    const state = stateForComponents([ [ A ], [ B ], [ C ], [ D ] ])
    const nextState = Studio.moveComponent(B, 0)(state)
    assert.deepEqual(nextState, stateForComponents([ [ B ], [ A ], [ C ], [ D ] ]))
  })
})
