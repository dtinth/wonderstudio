
import React from 'react'

export default React.createClass({
  propTypes: {
    onClick: React.PropTypes.func
  },
  onClick (e) {
    this.props.onClick(e)
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
