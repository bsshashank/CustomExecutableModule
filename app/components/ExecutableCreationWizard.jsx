// @flow

import React from 'react'
import Radium from 'radium'
import Reflux from 'reflux'
import fs from 'fs'
import path from 'path'
import Dropzone from 'react-dropzone'
import jsonfile from 'jsonfile'

const { execFile } = require('child_process')

class ExecutableCreationWizard extends Reflux.Component {
  fileStorage: Object
  workingFolder: string
  filesToUpload: Array<string>

  constructor(props) {
    super(props)
    this.fileStorage = this.props.fileStorage
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleNameChange = this.handleNameChange.bind(this)
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this)
    this.handleFileChange = this.handleFileChange.bind(this)
    this.executeModule = this.executeModule.bind(this)
    // this.displayModules = this.props.displayModules
    this.workingFolder = path.join(this.fileStorage.config.paths.data, this.fileStorage.extension)

    console.log('jsonModule passed in as props ' + this.props.jsonModule)

    if (this.props.jsonModule === '') {
      this.state = {
        editable: true,
        executableModuleName: '',
        executableModuleDescription: '',
        executableModuleFile: '',
        executableModuleOutputFilePath: ''
      }
    }
    else {
      let jsonModule = this.getJson(this.props.jsonModule)
      console.log('jsonModule read ' + jsonModule)
      this.state = {
        editable: false,
        executableModuleName: jsonModule.name,
        executableModuleDescription: jsonModule.description,
        executableModuleFile: jsonModule.files,
        executableModuleOutputFilePath: jsonModule.outputFilePath
      }
    }

    this.filesToUpload = []
  }

  handleSubmit(event) {
    event.preventDefault()
    this.createModule(this.state.executableModuleName, this.state.executableModuleDescription, this.filesToUpload)
  }

  generateJson(name, description, files) {
    const jsonModule = {
      name: name,
      description: description,
      files: files
    }
    return jsonModule
  }

  getJson(moduleName) {
    return jsonfile.readFileSync(path.join(this.workingFolder, moduleName + '.json'))
    /*return jsonfile.readFile(path.join(this.workingFolder, moduleName + '.json'), (jsonModule) => {
      return jsonModule
    })*/
  }

  saveJson(jsonModule) {
    jsonfile.writeFile(path.join(this.workingFolder, jsonModule.name + '.json'), jsonModule, () => {
      console.log('Module ' + jsonModule.name + ' has been successfully created')
    })
  }

  createModule(name, description, executableFiles) {
    const jsonModule = this.generateJson(name, description, executableFiles)
    this.saveJson(jsonModule)
  }

  handleNameChange(event) {
    this.setState({ executableModuleName: event.target.value })
  }

  handleDescriptionChange(event) {
    this.setState({ executableModuleDescription: event.target.value })
  }

  handleFileChange(files) {
    files.map((file) => {
      this.filesToUpload.push(path.join(file.path))
    })
  }

  handleexecutableModuleOutputFileChange(outputFile) {
    this.setState({ executableModuleOutputFilePath: event.target.value })
  }

  executeModule() {
      let executablePath = path.join(this.state.executableModuleFile.pop())
      const child = execFile(executablePath, ['--version'], (error, stdout, stderr) => {
      if (error) {
        throw error;
      }
      console.log(stdout);
    })
  }

  render() {
    /*let fieldSet = this.state.editable ? 'enabled' : 'disabled'

    const props = {fieldSet}*/

    return (
      <form>
        {/*<fieldset {...props}>*/}
        <div className='form-group'>
          <label className='form-label'>Name</label>
          <input className='form-input' type='text' id='executableModuleName' value={this.state.executableModuleName} onChange={this.handleNameChange} placeholder='Name of the new Executable' />
        </div>
        <div className='form-group'>
          <label className='form-label'>Description</label>
          <textarea className='form-input' id='executableModuleDescription' value={this.state.executableModuleDescription} onChange={this.handleDescriptionChange} placeholder='Description about the executableModule' rows='2' />
        </div>
        <div className='form-group'>
          <label className='form-label'>Output file path</label>
          <textarea className='form-input' id='executableModuleOutputFile' value={this.state.executableModuleOutputFile} onChange={this.handleexecutableModuleOutputFileChange} placeholder='File path where the output must be stored' rows='2' />
        </div>
        <div className='form-group'>
          <label className='form-label'>Executable File</label>
          {/*<input class='form-input' type='file' onChange={this.handleFileChange} id='executableModuleFile' value={this.state.executableModuleFile} />*/}
          <Dropzone key="dropZone" onDrop={this.handleFileChange} multiple
            style={{
              width: '62%',
              margin: 'auto',
              marginTop: '2em',
              marginBottom: '2em',
              borderStyle: 'dashed',
              height: '5em',
              borderWidth: '2px',
              borderColor: 'gray',
              textAlign: 'center',
              verticalAlign: 'middle'
            }}>
            <div style={{ marginTop: '1.5em', marginBottom: '1.5em' }}>
              Drop files or click here to select and upload the executable files and all the necessary additional files for processing
          </div>
          </Dropzone>
        </div>
        <button className='btn btn-primary' type='button' value={this.state.executableModuleFile} onClick={this.handleSubmit}>Save Module</button>
        <button className='btn btn-primary' type='button' onClick={this.props.displayModules}>Cancel</button>
        {this.state.editable ? null : <button className='btn btn-primary' type='button' onClick={this.executeModule}>Execute module</button>}
        {/*</fieldset>*/}
      </form>
    )
  }
}

export default Radium(ExecutableCreationWizard)