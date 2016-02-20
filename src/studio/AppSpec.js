
import * as App from './App'

function stateForComponents (groups) {
  return {
    ui: groups.map(components => ({ components }))
  }
}

describe('moveComponent(component, dropTarget)', function () {
  const A = { _id: 'A' }
  const B = { _id: 'B' }
  const C = { _id: 'C' }
  const D = { _id: 'D' }

  it('should move component to the correct position', function () {
    const state = stateForComponents([ [ A ], [ B ], [ C ], [ D ] ])
    const nextState = App.moveComponent(B, 0)(state)
    assert.deepEqual(nextState, stateForComponents([ [ B ], [ A ], [ C ], [ D ] ]))
  })
})

describe('renameComponent(component, newName)', function () {
  const A = { _id: 'A' }
  const B = { _id: 'B' }
  const B2 = { _id: 'B', name: 'wow' }

  it('should move component to the correct position', function () {
    const state = stateForComponents([ [ A ], [ B ] ])
    const nextState = App.renameComponent(B, 'wow')(state)
    assert.deepEqual(nextState, stateForComponents([ [ A ], [ B2 ] ]))
  })
})

describe('getComponentById', function () {
  const A = { _id: 'A' }
  const B = { _id: 'B' }
  const C = { _id: 'C' }
  const D = { _id: 'D' }

  it('should return component by id', function () {
    const state = stateForComponents([ [ A ], [ B ], [ C ], [ D ] ])
    const component = App.getComponentById('B')(state)
    assert(component === B)
  })

  it('should return null if not found', function () {
    const state = stateForComponents([ [ A ], [ B ], [ C ], [ D ] ])
    const component = App.getComponentById('MEOW')(state)
    assert(component === null)
  })
})
