
import { inferApplicationName } from './Utils'
import example from '../example-apps/welcome.yml'

describe('inferApplicationName', function () {
  it('infers application name from section header', function () {
    assert(inferApplicationName({ app: example }) === 'Welcome!')
  })
  it('if all else fails, just say untitled', function () {
    assert(inferApplicationName({ }) === 'Untitled App')
  })
})
