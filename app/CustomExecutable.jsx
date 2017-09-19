//@flow

import React from 'react'
import path from 'path'
import fs from 'fs'

import { defineMessages } from 'react-intl'
import { ic_apps } from 'react-icons-kit/md/ic_apps'

import packageInfo from './package.json'
import CustomExecutableView from './views/CustomExecutableView'
// import ExecutableCreationWizard from './components/ExecutableCreationWizard'

import type { ICommandHandler, IExtension, IFileStorage, ISettingManager, ITranslationManager, SettingType, TranslatableMessage } from 'electron-shell-lib'

class CustomExecutable implements IExtension {

    _messages:Object
    _settings: Array<SettingType>
    _fileStorage: IFileStorage
    _defaultRoute: string

    constructor() {
      this._messages = defineMessages({
        extName: {
          id: 'ext.customexecutable.name',
          description: 'The translated name of the CustomExecutable extension',
          defaultMessage: 'Custom Executable'
        },
        extDescription: {
          id: 'ext.customexecutable.description',
          description: 'The translated description of the CustomExecutable extension',
          defaultMessage: 'A Custom Executable module for the Electron boilerplate'
        }
      })
    }

    register(fileStorage: IFileStorage, settingsManager: ISettingManager, translationManager: ITranslationManager): Promise<*> {
      let regPromise = new Promise((resolve, reject) => {
        let msgs = require(path.join(__dirname, 'assets/msgs/en-US.json'))
        translationManager.import.triggerAsync('en-US', msgs).then(resolve).catch(reject)
      })

      return regPromise
    }

    unregister(fileStorage: IFileStorage, settingsManager: ISettingManager, translationManager: ITranslationManager): Promise<*> {
      let unregPromise = new Promise((resolve, reject) => {

      })

      return unregPromise
    }

    initialize(fileStorage: IFileStorage, commandHandler: ICommandHandler, settings: Array<SettingType>, defaultRoute: string): void {
      this._fileStorage = fileStorage
      this._settings = settings
      this._defaultRoute = defaultRoute

      let appWorkingDirectory = path.join(fileStorage.config.paths.data, fileStorage.extension)
      let asar = path.join(fileStorage.config.paths.data, 'Plugins', fileStorage.extension + '.asar')
      let asarFolderToExtract = 'extract'

      console.log('path config ' + JSON.stringify(fileStorage.config.paths))
      console.log('extraction path ' + appWorkingDirectory)
      console.log('plugin asar path ' + asar)

      if (!fs.existsSync(path.join(appWorkingDirectory))) {
        fs.mkdirSync(appWorkingDirectory);
      }

      fs.readdir(asar, function (err, files) {
        if (err)
          throw 'Error occurred while trying to extract the necessary files for the plugin installation'
        files.map(function (file) {
          return path.join(asar, file)
        }).filter(function (file) {
          return (path.basename(file) === asarFolderToExtract)
        }).forEach(function (file) {
          console.log('file ' + file)
          fs.readdir(file, function (err, files) {
            files.map(function (fileToExtract) {
              fs.createReadStream(path.join(file, fileToExtract)).pipe(fs.createWriteStream(path.join(appWorkingDirectory, path.basename(fileToExtract))))
            })
          })
        })
      })
      console.log('extraction completed')
    }

    get id(): string {
      return packageInfo.name
    }

    get name(): TranslatableMessage {
      return this._messages.extName
    }

    get version(): string {
      return packageInfo.version
    }

    get description(): TranslatableMessage {
      return this._messages.extDescription
    }

    get author(): string {
      return packageInfo.author
    }

    get bannerImage(): string {
      return path.join('assets', 'hello-world-banner.jpg')
    }

    get fileStorage(): IFileStorage {
      return this._fileStorage
    }

    get settings(): Array<SettingType> {
      return this._settings
    }

    get defaultRoute(): string {
      return this._defaultRoute
    }

    get linkIcon(): React$Element<*> {
      return (
        ic_apps
      )
    }

    get mainView(): React$Element<*> {
      return CustomExecutableView
    }

    get settingView(): ?React$Element<*> {
      return null
    }
}

let singletonInstance = new CustomExecutable()
exports.instance = singletonInstance
