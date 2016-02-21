
import React from 'react'
import styles from './MetaBar.styl'
import Icon from 'react-fa'

const Button = ({ children, onClick }) => <button
  className={styles.button}
  onClick={onClick}
>
  {children}
</button>

import { compile } from '../compiler'

function doCompile (app) {
  console.log(compile(app))
}

export default React.createClass({
  propTypes: {
    onClick: React.PropTypes.func,
    state: React.PropTypes.object
  },
  render () {
    return <div className={styles.root}>
      <Button onClick={() => doCompile(this.props.state.app)}>
        <Icon className={styles.playIcon} name='play' /> Run Application
      </Button>
    </div>
  }
})
