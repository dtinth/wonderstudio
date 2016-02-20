
import React from 'react'

export default React.createClass({
  componentDidMount () {
    document.body.classList.remove('is-loaded')
  },
  componentWillUnmount () {
    document.body.classList.add('is-loaded')
  },
  render () {
    return null
  }
})
