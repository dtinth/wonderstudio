
import React from 'react'
import * as Components from './Components'
import styles from './Widget.styl'

export default React.createClass({
  propTypes: {
    component: React.PropTypes.object,
    dispatch: React.PropTypes.func
  },
  onPropChange (name, value) {
    const component = this.props.component
    if (this.props.dispatch) {
      if (component._set) {
        this.props.dispatch(component._set(name, value))
      } else {
        console.warn('Widget', component, 'has no `_set` method.')
      }
    } else {
      console.warn('Widget', component, 'has nowhere to dispatch prop change.')
    }
  },
  render () {
    const component = this.props.component
    const Component = Components[component.type]
    if (Component) {
      return <div className={styles.root}>
        <Component {...component.props} onPropChange={this.onPropChange} />
      </div>
    } else {
      return <div className={styles.error}>Unknown component: <strong>{component.type}</strong></div>
    }
  }
})
