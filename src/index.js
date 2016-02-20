import React from 'react'
import { render } from 'react-dom'
import { Router, Route, browserHistory } from 'react-router'
import * as colors from 'material-ui/lib/styles/colors'

import 'normalize.css'
import './loading.styl'
import styles from './index.styl'
import { loadCSS } from 'fg-loadcss'

// Not sure why, but this fixes some weird bug where some modules cannot be loaded!
require.include('./app/Components')

document.body.className = styles.body

loadCSS('https://fonts.googleapis.com/css?family=Roboto:300,400,500,700')
loadCSS('https://fonts.googleapis.com/css?family=Roboto+Mono:400,700')
loadCSS('https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,700,600')

import reproxy from './reproxy'
import StudioAppProxy from 'react-proxy-loader?name=StudioApp!./studio/StudioApp'
import AppPageProxy from 'react-proxy-loader?name=AppPage!./app/AppPage'
import AppLoading from './loading/AppLoading'

const StudioApp = reproxy(StudioAppProxy, AppLoading)
const AppPage = reproxy(AppPageProxy, AppLoading)

const NotFound = () => <div style={{ textAlign: 'center', padding: 24, color: colors.red500 }}>
  Oops. Page not found.
</div>

const router = <Router history={browserHistory}>
  <Route path='/' component={StudioApp} />
  <Route path='/studio/:appId' component={StudioApp} />
  <Route path='/run/:appId' component={AppPage} />
  <Route path='/test/loading' component={AppLoading} />
  <Route path='/*' component={NotFound} />
</Router>

document.body.classList.add('is-loaded')
render(router, document.querySelector('#app'))
