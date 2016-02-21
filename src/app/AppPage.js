import React from 'react'
import AppRunner from './AppRunner'
import AppViewer from './AppViewer'
import CloudAppPage from '../cloud/CloudAppPage'
import { inferApplicationName } from './Utils'
import withServiceWorker from './withServiceWorker'

const TheAppRunner = React.createClass({
  propTypes: {
    app: React.PropTypes.object
  },
  componentDidMount () {
    setTimeout(() => {
      // Wow cool hack to generate a manifest on-the-fly!!
      var manifest = {
        short_name: inferApplicationName({ app: this.props.app }),
        icons: [
          {
            src: 'https://ss16-wonderstudio.firebaseapp.com/images/default_icon.png',
            sizes: '144x144',
            type: 'image/png'
          }
        ],
        display: 'standalone'
      }
      const url = 'data:application/json;base64,' + window.btoa(unescape(encodeURIComponent(JSON.stringify(manifest))))
      const link = document.createElement('link')
      link.href = url
      link.rel = 'manifest'
      document.querySelector('head').appendChild(link)
      this._deject = () => link.parentNode.removeChild(link)
    })
  },
  componentWillUnmount () {
    if (this._deject) this._deject()
  },
  render () {
    return <AppRunner app={this.props.app} component={AppViewer} />
  }
})

export default withServiceWorker(React.createClass({
  propTypes: {
    routeParams: React.PropTypes.object
  },
  render () {
    return <CloudAppPage
      cloudRef={{
        viewKey: this.props.routeParams.viewKey,
        editKey: this.props.routeParams.editKey
      }}
      component={TheAppRunner}
      key={this.props.routeParams.viewKey}
    />
  }
}))
