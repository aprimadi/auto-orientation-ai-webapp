// @flow

import React from 'react'
import ReactDOM from 'react-dom'

import App from '../../components/App'

export default function() {
  let el = document.getElementById('app')
  if (el) {
    let component = ReactDOM.render(<App />, el)
    console.log('component:', component)
  }
}