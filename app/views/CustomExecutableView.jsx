//@flow

import React from 'react'
import Radium from 'radium'
import Reflux from 'reflux'
import { withRouter } from 'react-router'
import { object } from 'prop-types'
import path from 'path'

import { Route, Redirect, Switch, Link } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'

import ExecutableCreationWizard from '../components/ExecutableCreationWizard'
import TableRenderer from '../components/TableRenderer'

class CustomExecutableView extends Reflux.Component {
  fileStorage: Object
  workingFolder: string
  moduleParams: object

  constructor(props) {
    super(props)
    this.fileStorage = this.props.fileStorage
    this.workingFolder = path.join(this.fileStorage.config.paths.data, this.fileStorage.extension)
    this.createModule = this.createModule.bind(this)
    this.toggleDisplayModule = this.toggleDisplayModule.bind(this)
    this.moduleParams = []

    //React to call from LibraryModule
    let request = props.location.state

    if(request != null && request.caller == "LibraryModule") {
      //distinguish between functions
      if(request.function == "pgp"){
        var data = request.document
        console.log("I need to encrypt this file: ", data)
        if(!Array.isArray(data)){
          this.moduleParams.push(data)
        }
        else
          this.moduleParams = this.moduleParams.concat(data)
        this.state = {
          displayWizard: true,
          jsonModule: 'gpg-email',
        }
      }
    }
    else
    {
      this.state = {
        displayWizard: false,
        jsonModule: ''
      }
    }
  }

  createModule(event) {
    this.setState((prevState, props) => {
      return { displayWizard: true }
    })
    this.forceUpdate(() => {
      console.log('updated component')
    })
  }

  toggleDisplayModule(jsonModule) {
    if (this.state.displayWizard == true) {
      this.setState((prevState, props) => {
        return {
          displayWizard: false,
          jsonModule: ''
        }
      })
    }
    else {
      this.setState((prevState, props) => {
        return {
          displayWizard: true,
          jsonModule: jsonModule
        }
      })
    }
  }

  render() {
    if (this.state.displayWizard)
      return <ExecutableCreationWizard fileStorage={this.fileStorage} jsonModule={this.state.jsonModule} params={this.moduleParams} displayModules={this.toggleDisplayModule} />
    else
      return (
        <div>
          <button className='btn btn-primary' type='button' onClick={this.createModule} >Create new Module</button>
          <TableRenderer modulesFolder={this.workingFolder} displayModule={this.toggleDisplayModule} />
        </div>
      )
  }
}

export default withRouter(Radium(CustomExecutableView))
