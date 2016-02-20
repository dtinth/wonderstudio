import React from 'react'
import {render} from 'react-dom'
import { Router, Route, browserHistory } from 'react-router'
import * as colors from 'material-ui/lib/styles/colors'

import 'normalize.css'
import styles from './index.styl'
import { loadCSS } from 'fg-loadcss'

document.body.className = styles.body

loadCSS('https://fonts.googleapis.com/css?family=Roboto:300,400,500,700')
loadCSS('https://fonts.googleapis.com/css?family=Roboto+Mono:400,700')
loadCSS('https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,700,600')

import StudioApp from './studio/StudioApp'
import AppPage from './app/AppPage'

const NotFound = () => <div style={{ textAlign: 'center', padding: 24, color: colors.red500 }}>
  Oops. Page not found.
</div>

const router = <Router history={browserHistory}>
  <Route path='/' component={StudioApp} />
  <Route path='/studio/:appId' component={StudioApp} />
  <Route path='/run/:appId' component={AppPage} />
  <Route path='/*' component={NotFound} />
</Router>

render(router, document.querySelector('#app'))
