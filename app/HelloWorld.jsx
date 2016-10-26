//@flow

import React from 'react'
import Radium from 'radium'

class HelloWorld extends React.Component {

  constructor (props) {
    super(props)
  }

  render () {
    return (
      <div>
        Hello World from HelloWorldModule
      </div>
    )
  }
}

export default Radium(HelloWorld)
