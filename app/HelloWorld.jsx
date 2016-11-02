//@flow

import React from 'react'
import Radium from 'radium'
import { Content, Spinner } from 'react-mdl'

class HelloWorld extends React.Component {

  constructor (props) {
    super(props)
  }

  render () {
    return (
      <div>
        <Spinner singleColor />
        Hello World from HelloWorldModule
      </div>
    )
  }
}

export default Radium(HelloWorld)
