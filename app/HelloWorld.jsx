//@flow

import React from 'react'
import path from 'path'

import { defineMessages } from 'react-intl'
import { ic_explore } from 'react-icons-kit/md/ic_explore'

import packageInfo from './package.json'
import HelloWorldView from './views/HelloWorldView'

import type { IExtension, IFileStorage, ISettingManager, ITranslationManager, SettingType, TranslatableMessage } from 'electron-shell-lib'

class HelloWorld implements IExtension {

    messages:Object
    constructor() {
      this.messages = defineMessages({
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

    register(settingsManager: ISettingManager, translationManager: ITranslationManager): Promise<*> {
      let regPromise = new Promise((resolve, reject) => {
        let msgs = require(path.join(__dirname, 'assets/msgs/en-US.json'))
        translationManager.import.triggerAsync('en-US', msgs).then(resolve).catch(reject)
      })

      return regPromise
    }

    unregister(settingsManager: ISettingManager, translationManager: ITranslationManager): Promise<*> {
      let unregPromise = new Promise((resolve, reject) => {

      })

      return unregPromise
    }

    initialize(fileStorage: IFileStorage, settings: Array<SettingType>): void {
    }

    get id(): string {
      return packageInfo.name
    }

    get name(): TranslatableMessage {
      return this.messages.extName
    }

    get version(): string {
      return packageInfo.version
    }

    get description(): TranslatableMessage {
      return this.messages.extDescription
    }

    get author(): string {
      return packageInfo.author
    }

    get bannerImage(): string {
      return path.join(__dirname, 'assets', 'hello-world-banner.jpg')
    }

    get initialRoute(): string {
      return `ext.${packageInfo.name.toLowerCase()}`
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
