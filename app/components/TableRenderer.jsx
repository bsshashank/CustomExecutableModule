// @flow

import React from 'react'
import Radium from 'radium'
import Reflux from 'reflux'
import fs from 'fs'
import path from 'path'

class TableRenderer extends Reflux.Component {
  modulesFolder: string
  customModules: Array

  constructor(props) {
    super(props)
    this.customModules = []
    this.modulesFolder = this.props.modulesFolder
    let files = fs.readdirSync(this.modulesFolder)
    files.map((file) => {
      let jsonModule = JSON.parse(fs.readFileSync(path.join(this.modulesFolder, file), 'utf8'))
      this.customModules.push(jsonModule)
    })
    this.state = {
      jsonModuleName: ''
    }
    this.updateView = this.updateView.bind(this)
  }

  updateView(moduleName) {
    this.setState({displayWizard: false, jsonModule: moduleName}, () => {
      this.props.displayModule(moduleName)
    })
  }

  render() {
    const getFileString = (jsonModuleFiles) => {
      let fileString = ''
      /*jsonModuleFiles.map((file) => {
        fileString += file + ','
      })*/
      for(let i=0; i<jsonModuleFiles.length; i++)
        fileString += jsonModuleFiles[i] + ','
      return fileString.trim()
    }
    const DisplayRow = (jsonModule) => {
      return (
        <tr key={jsonModule.name + 'row'}>
          <td key={jsonModule.name}>{jsonModule.name}</td>
          <td key={jsonModule.description}>{jsonModule.description}</td>
          {/*<td key='files'>{getFileString(jsonModule.files)}</td>*/}
          <td key={jsonModule.name + 'button'}><button onClick={() => this.updateView(jsonModule.name)} className="btn btn-primary">Open module</button></td>
        </tr>
      )
    }
    return (
      <table className='table table-striped table-hover'>
        <thead>
          <tr key='header'>
            <th>Module Name</th>
            <th>Module Description</th>
            {/*<th>Files</th>*/}
            <th>Open Module</th>
          </tr>
        </thead>
        <tbody>
          {
            this.customModules.map(jsonModule => {
              return DisplayRow(jsonModule)
            })
          }
        </tbody>
      </table>
    )
  }
}

export default Radium(TableRenderer)
