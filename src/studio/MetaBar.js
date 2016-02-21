
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

export default React.createClass({
  propTypes: {
    dispatch: React.PropTypes.func,
    query: React.PropTypes.func,
    state: React.PropTypes.object
  },
  renderCompileButton () {
    if (this.props.query(studio => studio.isRunning())) {
      return <Button onClick={() => this.props.dispatch(studio => studio.stopRunning())}>
        <Icon className={styles.playIcon} name='stop' /> Stop Application
      </Button>
    } else {
      return <Button onClick={() => {
        const compiledApp = compile(this.props.state.app)
        this.props.dispatch(studio => studio.startRunning(compiledApp))
      }}>
        <Icon className={styles.playIcon} name='play' /> Run Application
      </Button>
    }
  },
  render () {
    return <div className={styles.root}>
      {this.renderCompileButton()}
    </div>
  }
})
