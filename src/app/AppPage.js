import React from 'react'
import uncompiledApp from '../example-apps/welcome.yml'
import AppRunner from './AppRunner'
import AppViewer from './AppViewer'
import { compile } from '../compiler'

// TODO: Don’t compile in run mode. Compile in editor!
const compiledApp = compile(uncompiledApp)

export default React.createClass({
  render () {
    return <AppRunner app={compiledApp} component={AppViewer} />
  }
})
