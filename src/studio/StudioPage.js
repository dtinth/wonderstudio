
import React from 'react'
import StudioApp from './StudioApp'
import welcomeApp from '../example-apps/welcome.yml'
import CloudAppPage from '../cloud/CloudAppPage'
import DangerousButNecessarySharedMutableState from './DangerousButNecessarySharedMutableState'

const CloudStudioApp = ({ app, cloudRef }) => <StudioApp
  initializationData={{ app, cloudRef }}
/>

export default React.createClass({
  propTypes: {
    routeParams: React.PropTypes.object
  },
  render () {
    const viewKey = this.props.routeParams.viewKey
    if (viewKey && DangerousButNecessarySharedMutableState.newAppViewKey !== viewKey) {
      return <CloudAppPage
        cloudRef={{
          viewKey: this.props.routeParams.viewKey,
          editKey: this.props.routeParams.editKey
        }}
        component={CloudStudioApp}
        key={this.props.routeParams.viewKey}
      />
    } else {
      return <StudioApp initializationData={{ app: welcomeApp }} />
    }
  }
})
