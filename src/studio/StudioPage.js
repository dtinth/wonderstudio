
import React from 'react'
import StudioApp from './StudioApp'
import welcomeApp from '../example-apps/welcome.yml'
import { getApplication } from '../cloud'
import ErrorPage from '../app/ErrorPage'
import LoadingPage from '../app/LoadingPage'
import DangerousButNecessarySharedMutableState from './DangerousButNecessarySharedMutableState'

const CloudStudioApp = React.createClass({
  propTypes: {
    cloudRef: React.PropTypes.object
  },
  getInitialState () {
    return { app: null, status: 'loading' }
  },
  componentDidMount () {
    const run = async function () {
      try {
        const app = await getApplication({ viewKey: this.props.cloudRef.viewKey })
        this.setState({ status: 'completed', app: app })
      } catch (e) {
        this.setState({ status: 'error', error: e })
      }
    }
    run.call(this)
  },
  render () {
    if (this.state.app) {
      return <StudioApp
        initializationData={{
          app: this.state.app,
          cloudRef: this.props.cloudRef
        }}
      />
    } else if (this.state.status === 'error') {
      return <ErrorPage error={this.state.error} />
    } else {
      return <LoadingPage activity='loading the requested app…' />
    }
  }
})

export default React.createClass({
  propTypes: {
    routeParams: React.PropTypes.object
  },
  render () {
    const viewKey = this.props.routeParams.viewKey
    if (viewKey && DangerousButNecessarySharedMutableState.newAppViewKey !== viewKey) {
      return <CloudStudioApp
        cloudRef={{
          viewKey: this.props.routeParams.viewKey,
          editKey: this.props.routeParams.editKey
        }}
        key={this.props.routeParams.viewKey}
      />
    } else {
      return <StudioApp initializationData={{ app: welcomeApp }} />
    }
  }
})
