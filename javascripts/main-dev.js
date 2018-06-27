// @flow

import $ from 'jquery'
import injectTapEventPlugin from 'react-tap-event-plugin'

import init from './initializers/pages'

import '../static/css/main.css'

(function() {
  injectTapEventPlugin()

  $(document).ready(function() {
    init()
  })
})()
