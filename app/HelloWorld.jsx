//@flow

import React from 'react'
import path from 'path'

import { defineMessages } from 'react-intl'

import Icon from 'react-icons-kit'
import { ic_explore } from 'react-icons-kit/md/ic_explore'

import packageInfo from './package.json'
import HelloWorldView from './views/HelloWorldView'

import type { IExtension, IFileStorage, ISettingManager, ITranslationManager, SettingType } from 'electron-shell-lib'

class HelloWorld implements IExtension {

    register(settingsManager: ISettingManager, translationManager: ITranslationManager): Promise<*> {
      let regPromise = new Promise((resolve, reject) => {
        const messages = defineMessages({
          extName: {
            id: 'ext.helloworld.name',
            description: 'The translated name of the HelloWorld extension',
            defaultMessage: 'HelloWorld'
          },
          extDescription: {
            id: 'ext.helloworld.description',
            description: 'The translated description of the HelloWorld extension',
            defaultMessage: 'A Hello World module for the Electron boilerplate'
          }
        })
        resolve({})
      })

      return regPromise
    }

    unregister(settingsManager: ISettingManager, translationManager: ITranslationManager): Promise<*> {
      let unregPromise = new Promise((resolve, reject) => {

      })

      return unregPromise
    }

    initialize(fileStorage: IFileStorage, settings: Array<SettingType>): Promise<*> {
      let initPromise = new Promise((resolve, reject) => {

      })

      return initPromise
    }

    get id(): string {
      return packageInfo.name
    }

    get name(): string {
      return packageInfo.name
    }

    get version(): string {
      return packageInfo.version
    }

    get description(): string {
      return packageInfo.description
    }

    get author(): string {
      return packageInfo.author
    }

    get bannerImage(): string {
      return path.join(__dirname, 'assets', 'hello-world-banner.jpg')
    }

    get initialRoute(): string {
      return packageInfo.name.toLowerCase()
    }

    get linkIcon(): React$Element<*> {
      return (
        <Icon icon={ic_explore} size={24} />
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
