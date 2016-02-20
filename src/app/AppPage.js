import React from 'react'
import app from '../example-apps/welcome.yml'
import AppRunner from './AppRunner'

export default React.createClass({
  render () {
    return <AppRunner app={app} />
  }
})
