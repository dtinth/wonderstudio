import React from 'react'
import AppRunner from './AppRunner'
import AppViewer from './AppViewer'
import CloudAppPage from '../cloud/CloudAppPage'

const TheAppRunner = ({ app }) => <AppRunner app={app} component={AppViewer} />

export default React.createClass({
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
})
