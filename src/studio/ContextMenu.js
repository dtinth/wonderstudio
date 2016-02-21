import React from 'react'
import { findDOMNode } from 'react-dom'
import styles from './ContextMenu.styl'

export default React.createClass({
  propTypes: {
    onClose: React.PropTypes.func,
    component: React.PropTypes.object,
    dispatch: React.PropTypes.object
  },
  componentDidMount () {
    document.addEventListener('mousedown', this.onMouseDown, true)
  },
  componentWillUnmount () {
    document.removeEventListener('mousedown', this.onMouseDown, true)
  },
  onMouseDown (e) {
    const me = findDOMNode(this)
    let c = e.target
    while (c) {
      if (c === me) return
      c = c.parentNode
    }
    e.preventDefault()
    e.stopPropagation()
    this.props.onClose()
  },
  onRemove () {
    this.props.dispatch(studio =>
      studio.toApp(app => app.removeComponent(this.props.component))
    )
    this.props.onClose()
  },
  render () {
    const { component } = this.props
    return <ul className={styles.root}>
      <li><a href='javascript://' onClick={this.onRemove}>Remove {component.name}</a></li>
    </ul>
  }
})
