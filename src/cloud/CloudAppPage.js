
import React from 'react'
import LoadingPage from '../app/LoadingPage'
import ErrorPage from '../app/ErrorPage'
import { getApplication } from './'

export default React.createClass({
  propTypes: {
    cloudRef: React.PropTypes.object,
    component: React.PropTypes.func
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
      const Component = this.props.component
      return <Component
        app={this.state.app}
        cloudRef={this.props.cloudRef}
      />
    } else if (this.state.status === 'error') {
      return <ErrorPage error={this.state.error} />
    } else {
      return <LoadingPage activity='loading the requested app…' />
    }
  }
})
