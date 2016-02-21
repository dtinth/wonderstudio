
import React from 'react'
import styles from './MetaBar.styl'
import Icon from 'react-fa'
import { share, runApp } from './StudioIO'

const Button = ({ children, onClick, disabled }) => <button
  className={styles.button}
  onClick={onClick}
  disabled={disabled}
>
  {children}
</button>

export default React.createClass({
  propTypes: {
    store: React.PropTypes.object
  },
  renderCompileButton () {
    const { store } = this.props
    if (store.query(studio => studio.isRunning())) {
      return <Button onClick={() => store.dispatch(studio => studio.stopRunning())}>
        <Icon className={styles.playIcon} name='stop' /> Stop Application
      </Button>
    } else {
      return <Button onClick={this.onRun}>
        <Icon className={styles.playIcon} name='play' /> Run Application
      </Button>
    }
  },
  renderShareButton () {
    const { store } = this.props
    if (store.query(studio => studio.isPublishing())) {
      return <Button disabled>Saving...</Button>
    } else {
      return <Button onClick={this.onShare}>
        <Icon name='share' /> Save and Share
      </Button>
    }
  },
  onRun () {
    runApp(this.props.store)
  },
  onShare () {
    share(this.props.store)
  },
  render () {
    return <div className={styles.root}>
      {this.renderCompileButton()}
      <div className={styles.spacer}></div>
      {this.renderShareButton()}
    </div>
  }
})
