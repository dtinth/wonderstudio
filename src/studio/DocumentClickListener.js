
import React from 'react'

export default React.createClass({
  propTypes: {
    onClick: React.PropTypes.func
  },
  onClick () {
    this.props.onClick()
  },
  componentDidMount () {
    window.addEventListener('click', this.onClick)
  },
  componentWillUnmount () {
    window.removeEventListener('click', this.onClick)
  },
  render () {
    return null
  }
})
