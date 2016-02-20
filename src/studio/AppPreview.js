import React from 'react'
import styles from './AppPreview.styl'
import Widget from '../app/Widget'
import WidgetGroup from '../app/WidgetGroup'

export default React.createClass({
  propTypes: {
    app: React.PropTypes.object
  },
  renderWidget (component) {
    return <Widget component={component} />
  },
  renderGroup (group) {
    const componentNames = group.components.map(component => component.name).join(', ')
    return <div className={styles.group}>
      <div className={styles.groupLabel}>
        {componentNames}
      </div>
      <div className={styles.groupContent}>
        <WidgetGroup>
          {group.components.map(this.renderWidget)}
        </WidgetGroup>
      </div>
    </div>
  },
  render () {
    return <div className={styles.root}>
      <div className={styles.content}>
        <div className={styles.backdrop}></div>
        {this.props.app.ui.map(this.renderGroup)}
        <div className={styles.group}>
          <div className={styles.groupContent}>
            <div className={styles.newControl}>
              <button>add a new control</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  }
})
