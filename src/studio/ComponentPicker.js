import React from 'react'
import styles from './ComponentPicker.styl'
import Panel, { SectionTitle } from './Panel'
import * as Components from '../app/Components'

export default React.createClass({
  propTypes: {
    onPick: React.PropTypes.func
  },
  renderComponent (name) {
    return <a
      href='javascript://'
      className={styles.listItem}
      onClick={() => this.props.onPick(name)}
    >
      {name}
    </a>
  },
  render () {
    return <Panel title='New Control'>
      <SectionTitle>Pick a control:</SectionTitle>
      {Object.keys(Components).map(this.renderComponent)}
    </Panel>
  }
})
