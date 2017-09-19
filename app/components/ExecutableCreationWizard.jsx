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
    this.handleFileChange = this.handleFileChange.bind(this)
    this.handleFormInputChange = this.handleFormInputChange.bind(this)
    this.executeModule = this.executeModule.bind(this)
    this.workingFolder = path.join(this.fileStorage.config.paths.data, this.fileStorage.extension)

    console.log('jsonModule passed in as props ' + this.props.jsonModule)

    if (this.props.jsonModule === '') {
      this.state = {
        editable: true,
        executableModuleName: '',
        executableModuleDescription: '',
        executableModuleOutputFilePath: '',
        executableModuleArgs:'',
        executableModuleFile: '',
        executableModuleOutput:'Output of the operation will be displayed here.'
      }
    }
    else {
      let jsonModule = this.getJson(this.props.jsonModule)
      if(this.props.params != undefined){
        let args = jsonModule.args
        args = args.substring(args.indexOf(';') + 1)
        let modifiedArgs = path.dirname(path.join(this.props.params.pop())) + ';' + args
        jsonModule.args = modifiedArgs
      }
      this.state = {
        editable: false,
        executableModuleName: jsonModule.name,
        executableModuleDescription: jsonModule.description,
        executableModuleOutputFilePath: jsonModule.outputFilePath,
        executableModuleArgs: jsonModule.args,
        executableModuleFile: jsonModule.files,
        executableModuleOutput:'Output of the operation will be displayed here.'
      }
      this.createModule(this.generateJson(this.state.executableModuleName, this.state.executableModuleDescription, this.state.executableModuleOutputFilePath, this.state.executableModuleArgs, this.state.executableModuleFile))
      console.log('saved module with args ' + this.state.executableModuleArgs)
    }
  }

  handleSubmit(event) {
    event.preventDefault()
    this.createModule(this.generateJson(this.state.executableModuleName, this.state.executableModuleDescription, this.state.executableModuleOutputFilePath, this.state.executableModuleArgs, this.state.executableModuleFile))
  }

  generateJson(name, description, outputFilePath, args, files) {
    const jsonModule = {
      name: name,
      description: description,
      outputFilePath: outputFilePath,
      args: args,
      files: files
    }
    return jsonModule
  }

  getJson(moduleName) {
    return jsonfile.readFileSync(path.join(this.workingFolder, moduleName + '.json'))
  }

  saveJson(jsonModule) {
    jsonfile.writeFile(path.join(this.workingFolder, jsonModule.name + '.json'), jsonModule, () => {
      if(this.state.editable)
      {
        this.props.displayModules()
      }
    })
  }

  createModule(jsonModule) {
    this.saveJson(jsonModule)
  }

  handleFileChange(files) {
    files.map((file) => {
      this.setState({ executableModuleFile: path.join(file.path) })
    })
  }

  handleFormInputChange(event) {
    this.setState({ [event.target.name]: event.target.value })
  }

  executeModule() {
    let executablePath = this.state.executableModuleFile
    let outputPath = path.join(this.state.executableModuleOutputFilePath)
    let args = this.state.executableModuleArgs.split(';')

    const child = execFile(executablePath, args, (error, stdout, stderr) => {
      if (error) {
        throw error;
      }
      console.log(stdout);
      this.setState({ executableModuleOutput: stdout })
      fs.writeFileSync(outputPath, stdout)
    })
  }

  render() {
    return (
    <form>
      <div className='form-group'>
        <label className='form-label'>Name</label>
        <input className='form-input' type='text' id='executableModuleName' name='executableModuleName' value={this.state.executableModuleName} onChange={this.handleFormInputChange} placeholder='Name of the new Executable' />
      </div>
      <div className='form-group'>
        <label className='form-label'>Description</label>
        <textarea className='form-input' id='executableModuleDescription' name='executableModuleDescription' value={this.state.executableModuleDescription} onChange={this.handleFormInputChange} placeholder='Description about the executableModule' rows='2' />
      </div>
      <div className='form-group'>
        <label className='form-label'>Output file path</label>
        <textarea className='form-input' id='executableModuleOutputFilePath' name='executableModuleOutputFilePath' value={this.state.executableModuleOutputFilePath} onChange={this.handleFormInputChange} placeholder='File path where the output must be stored' />
      </div>
      <div className='form-group'>
        <label className='form-label'>Program arguments</label>
        <textarea className='form-input' id='executableModuleArgs' name='executableModuleArgs' value={this.state.executableModuleArgs} onChange={this.handleFormInputChange} placeholder='Arguments to be supplied for the Executable Module' rows='2' />
      </div>
      <div className='form-group'>
        <label className='form-label'>Selected Executable File</label>
        <fieldset disabled>
          <textarea className='form-input' id='executableModuleFile' name='executableModuleFile' value={this.state.executableModuleFile} placeholder='Drag and drop executable' />
        </fieldset>
      </div>
      <div className='form-group'>
        <label className='form-label'>Executable File</label>
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
      <div className="form-group">
        <label className="form-label">Output</label>
        <fieldset disabled>
          <textarea className="form-input" id="executableModuleOutput" name='executableModuleOutput' value={this.state.executableModuleOutput} onChange={this.handleFormInputChange} rows="5"></textarea>
        </fieldset>
      </div>
    </form>
    )
  }
}

export default Radium(ExecutableCreationWizard)
