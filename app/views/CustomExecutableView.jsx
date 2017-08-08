//@flow

import React from 'react'
import Radium from 'radium'
import Reflux from 'reflux'
import { object } from 'prop-types'
import path from 'path'

import { Route, Redirect, Switch, Link } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'

import ExecutableCreationWizard from '../components/ExecutableCreationWizard'
import TableRenderer from '../components/TableRenderer'

class CustomExecutableView extends Reflux.Component {
  fileStorage: Object
  workingFolder: string

  constructor(props) {
    super(props)
    this.fileStorage = this.props.fileStorage
    this.workingFolder = path.join(this.fileStorage.config.paths.data, this.fileStorage.extension)
    this.createModule = this.createModule.bind(this)
    this.toggleDisplayModule = this.toggleDisplayModule.bind(this)
    this.state = {
      displayWizard: false,
      jsonModule: ''
    }
  }

  createModule(event) {
    console.log('clicked on createNewModule button ')
    this.setState((prevState, props) => {
      return { displayWizard: true }
    })
    this.forceUpdate(() => {
      console.log('updated component')
    })
  }

  toggleDisplayModule(jsonModule) {
    console.log('jsonModule from executable view ' + JSON.stringify(jsonModule))
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
      return <ExecutableCreationWizard fileStorage={this.fileStorage} jsonModule={this.state.jsonModule} displayModules={this.toggleDisplayModule} />
    else
      return (
        <div>
          <button className='btn btn-primary' type='button' onClick={ this.createModule } > Create new Module</button>
          <TableRenderer modulesFolder={this.workingFolder} displayModule={this.toggleDisplayModule} />
        </div>
      )
    // const baseUri = this.props.match.url
    /*return(
      <div style={{ height: '100%', width: '100%', display: 'flex' }}>
        <div className='column col-3' style={{ borderRight: '.1rem solid #f0f1f4', paddingLeft: '1em' }}>
          <h4>ExecutableModule</h4>
          <div className='divider' />
          <ul className='nav'>
            <NavItem target={`${baseUri}/newModuleWizard`}>
              <FormattedMessage id='app.customexecutablemodule.nav.newmodulewizard'
                description='Navigational link to new custom module wizard'
                defaultMessage='New Module Wizard' />
            </NavItem>
          </ul>
        </div>
        <div className='column col-9' style={{ paddingLeft: '1em', height: '80vh' }}>
          <Switch>
            <Route path={`${baseUri}/newModuleWizard`} component={ExecutableCreationWizard} />
            <Route exact path={baseUri} render={() => (<Redirect to={`${baseUri}/newModuleWizard`} />)} />
          </Switch>
        </div>
      </div>
    )*/
  }
}

export default Radium(CustomExecutableView)
