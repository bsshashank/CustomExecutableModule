//@flow

import React from 'react'
import Radium from 'radium'
import Reflux from 'reflux'

import { FormattedMessage } from 'react-intl'

class HelloWorldView extends Reflux.Component {

  render () {
    return (
      <div>
        <FormattedMessage  id='ext.helloworld.main.welcometext'
                           description='Hello World Welcome text'
                           defaultMessage='Hello World' />
      </div>
    )
  }
}

export default Radium(HelloWorldView)
