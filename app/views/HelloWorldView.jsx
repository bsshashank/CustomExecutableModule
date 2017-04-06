//@flow

import React from 'react'
import Radium from 'radium'
import Reflux from 'reflux'

import { TranslatedMessage } from 'react-intl'

class HelloWorldView extends Reflux.Component {

  render () {
    return (
      <div>
        Hello World from HelloWorldModule
      </div>
    )
  }
}

export default Radium(HelloWorldView)
