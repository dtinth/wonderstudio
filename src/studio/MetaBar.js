
import React from 'react'
import styles from './MetaBar.styl'
import Icon from 'react-fa'
import { compose, pure, mapPropsOnChange } from 'recompose'
import { share, runApp } from './StudioIO'
import SuccessPanel from './SuccessPanel'
import DocumentClickListener from './DocumentClickListener'

const Button = ({ children, onClick, disabled }) => <button
  className={styles.button}
  onClick={onClick}
  disabled={disabled}
>
  {children}
</button>

export default compose(
  mapPropsOnChange([ 'store' ], ({ store }) => ({
    didPublish: store.query(studio => studio.didPublish()),
    store: store
  })),
  pure
)(React.createClass({
  propTypes: {
    store: React.PropTypes.object,
    didPublish: React.PropTypes.bool
  },
  getInitialState () {
    return {
      showPublished: false
    }
  },
  componentWillReceiveProps (nextProps) {
    if (!this.props.didPublish && nextProps.didPublish) {
      this.setState({ showPublished: true })
    }
  },
  renderCompileButton () {
    const { store } = this.props
    if (store.query(studio => studio.isRunning())) {
      return <Button onClick={() => store.dispatch(studio => studio.stopRunning())}>
        <Icon className={styles.playIcon} name='stop' /> Stop Application
      </Button>
    } else if (store.query(studio => studio.isCompiling())) {
      return <Button disabled>Compiling…</Button>
    } else {
      return <Button onClick={this.onRun}>
        <Icon className={styles.playIcon} name='play' /> Run Application
      </Button>
    }
  },
  renderShareButton () {
    const { store } = this.props
    if (store.query(studio => studio.isPublishing())) {
      return <Button disabled>Saving…</Button>
    } else if (store.query(studio => studio.isNew())) {
      return <Button onClick={this.onShare}>
        <Icon name='share' /> Save and Share
      </Button>
    } else {
      return <Button onClick={this.onShare}>
        <Icon name='upload' /> Publish Update
      </Button>
    }
  },
  renderSuccess () {
    if (!this.state.showPublished) return null
    const { store } = this.props
    return <div className={styles.successPanel} onClick={e => e.stopPropagation()}>
      <DocumentClickListener onClick={() => this.setState({ showPublished: false })} />
      <SuccessPanel cloudRef={store.query(studio => studio.getCloudRef())} />
    </div>
  },
  onRun () {
    runApp(this.props.store)
  },
  onShare () {
    share(this.props.store)
  },
  render () {
    return <div className={styles.root}>
      <div className={styles.bar}>
        {this.renderCompileButton()}
        <div className={styles.spacer}></div>
        {this.renderShareButton()}
      </div>
      {this.renderSuccess()}
    </div>
  }
}))
