import React from 'react'
import styles from './SuccessPanel.styl'
import Panel from './Panel'
import { shorten } from '../cloud/URLShortener'

export default React.createClass({
  propTypes: {
    cloudRef: React.PropTypes.object
  },
  getInitialState () {
    return { shortUrl: null }
  },
  getLongUrl () {
    return 'https://ss16-wonderstudio.firebaseapp.com/app/' + this.props.cloudRef.viewKey
  },
  getUrl () {
    return this.state.shortUrl || this.getLongUrl()
  },
  componentDidMount () {
    void (shorten(this.getLongUrl())
      .then(url => this.setState({ shortUrl: url }))
      .catch(error => {
        console.error('Cannot shorten URL: ' + error)
        this.setState({ shortUrl: false })
      })
    )
  },
  renderQR () {
    const imageUrl = 'https://chart.googleapis.com/chart?cht=qr&chs=192x192&chl=' + encodeURIComponent(this.getUrl()) + '&chld=M|2'
    return <div className={styles.qr}>
      {this.state.shortUrl === null ? null : <img src={imageUrl} />}
    </div>
  },
  render () {
    const url = this.getUrl()
    return <div className={styles.root}>
      <Panel title='Success!'>
        <div className={styles.content}>
          <div className={styles.qr}>
            {this.renderQR()}
          </div>
          <div className={styles.text}>
            <div className={styles.yay}>
              <strong>Your mobile application has been published.</strong><br />
            </div>
            <div className={styles.url}>
              Access it from your phone using this URL:
              <input
                readOnly
                onMouseOver={e => { e.target.focus(); e.target.select() }}
                className={styles.urlInput}
                value={url}
              />
            </div>
          </div>
        </div>
      </Panel>
    </div>
  }
})
