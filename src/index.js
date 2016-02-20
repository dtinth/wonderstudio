import React from 'react'
import {render} from 'react-dom'
import 'normalize.css'
import './index.styl'
import loadCSS from 'fg-loadcss'

import StudioApp from './studio/StudioApp'

render(<StudioApp />, document.querySelector('#app'))

loadCSS('http://fonts.googleapis.com/css?family=Roboto:300,400,500,700')
loadCSS('https://fonts.googleapis.com/css?family=Roboto+Mono:400,700')
