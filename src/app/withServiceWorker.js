
// Install service worker first.
// From bemuse project: https://github.com/bemusic/bemuse/blob/d6cdb9e135fcd8ccb2e0afb6935fe07d63cc4c78/src/app/index.js

import React from 'react'
import LoadingPage from './LoadingPage'

function registerServiceWorker () {
  return navigator.serviceWorker.register('/sw.js', { scope: '/' })
}

function supportsServiceWorker () {
  if (!('serviceWorker' in navigator)) return false
  if (window.location.host !== 'wonderstudio.dev' && window.location.host !== 'ss16-wonderstudio.firebaseapp.com') {
    return false
  }
  if (window.location.protocol !== 'https:') return false
  return true
}

async function setupServiceWorker () {
  if (!supportsServiceWorker()) return false
  if (navigator.serviceWorker.controller) {
    registerServiceWorker()
    return true
  } else {
    try {
      await registerServiceWorker()
      console.log('Service worker registered!')
      await new Promise(function () {
        window.location.reload()
      })
    } catch (e) {
      console.error('Service worker cannot be registered!', e)
    }
  }
}

export default BaseComponent => React.createClass({
  getInitialState () {
    return { done: !supportsServiceWorker() }
  },
  componentDidMount () {
    if (!this.state.done) {
      setupServiceWorker().then(() => this.setState({ done: true }))
    }
  },
  render () {
    if (this.state.done) {
      return <BaseComponent {...this.props} />
    } else {
      return <LoadingPage activity='setting up service worker' />
    }
  }
})
