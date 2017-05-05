//@flow

import React from 'react'
import path from 'path'

import { defineMessages } from 'react-intl'
import { ic_explore } from 'react-icons-kit/md/ic_explore'

import packageInfo from './package.json'
import HelloWorldView from './views/HelloWorldView'

import type { ICommandHandler, IExtension, IFileStorage, ISettingManager, ITranslationManager, SettingType, TranslatableMessage } from 'electron-shell-lib'

class HelloWorld implements IExtension {

    _messages:Object
    _settings: Array<SettingType>
    _fileStorage: IFileStorage
    _defaultRoute: string

    constructor() {
      this._messages = defineMessages({
        extName: {
          id: 'ext.helloworld.name',
          description: 'The translated name of the HelloWorld extension',
          defaultMessage: 'Hello World'
        },
        extDescription: {
          id: 'ext.helloworld.description',
          description: 'The translated description of the HelloWorld extension',
          defaultMessage: 'A Hello World module for the Electron boilerplate'
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
        ic_explore
      )
    }

    get mainView(): React$Element<*> {
      return HelloWorldView
    }

    get settingView(): ?React$Element<*> {
      return null
    }
}

let singletonInstance = new HelloWorld()
exports.instance = singletonInstance
