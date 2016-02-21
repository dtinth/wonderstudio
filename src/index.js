// Polyfillify!
import 'babel-polyfill'

// Import React to use react-router
import React from 'react'
import { render } from 'react-dom'
import { Router, Route, browserHistory } from 'react-router'

// Performance measuring!
if (process.env.NODE_ENV === 'development') {
  window.Perf = require('react-addons-perf')
}

// Material-UI prerequisites
import * as colors from 'material-ui/lib/styles/colors'
import injectTapEventPlugin from 'react-tap-event-plugin'
injectTapEventPlugin()

// Fonts
import { loadCSS } from 'fg-loadcss'
loadCSS('https://fonts.googleapis.com/css?family=Roboto:300,400,500,700')
loadCSS('https://fonts.googleapis.com/css?family=Roboto+Mono:400,700')
loadCSS('https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,700,600')

// Stylesheets
import 'normalize.css'
import './loading.styl'
import './index.styl'

// Not sure why, but this fixes some weird bug where some modules cannot be loaded!
require.include('./app/Components')

import reproxy from './reproxy'
import StudioPageProxy from 'react-proxy-loader?name=StudioPage!./studio/StudioPage'
import AppPageProxy from 'react-proxy-loader?name=AppPage!./app/AppPage'
import AppLoading from './loading/AppLoading'

const StudioPage = reproxy(StudioPageProxy, AppLoading)
const AppPage = reproxy(AppPageProxy, AppLoading)

const NotFound = () => <div style={{ textAlign: 'center', padding: 24, color: colors.red500 }}>
  Oops. Page not found.
</div>

const router = <Router history={browserHistory}>
  <Route path='/' component={StudioPage} />
  <Route path='/app/:viewKey/studio/:editKey' component={StudioPage} />
  <Route path='/app/:viewKey' component={AppPage} />
  <Route path='/test/loading' component={AppLoading} />
  <Route path='/*' component={NotFound} />
</Router>

document.body.classList.add('is-loaded')
render(router, document.querySelector('#app'))
