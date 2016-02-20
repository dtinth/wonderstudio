import React from 'react'
import styles from './AppPreview.styl'

import RaisedButton from 'material-ui/lib/raised-button'

export default React.createClass({
  propTypes: {
    app: React.PropTypes.object
  },
  renderComponent (component) {
    return <div className={styles.group}>
      <div className={styles.groupLabel}>
        {component.name}
      </div>
      <div className={styles.groupContent}>
        {this.renderWidget(component)}
      </div>
    </div>
  },
  renderWidget (component) {
    return <div>
      <RaisedButton label={'WOW'} style={{ width: '100%' }} />
    </div>
  },
  render () {
    return <div className={styles.root}>
      <div className={styles.backdrop}></div>
      {this.props.app.components.map(this.renderComponent)}
    </div>
  }
})
