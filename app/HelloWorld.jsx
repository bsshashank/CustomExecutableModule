//@flow

import path from 'path'

import packageInfo from './package.json'
import HelloWorldView from './views/HelloWorldView'

import type { IExtension, IFileStorage, ISettingManager, ITranslationManager, SettingType } from 'electron-shell-lib'

class HelloWorld implements IExtension {

    register(settingsManager: ISettingManager, translationManager: ITranslationManager): Promise<*> {
      let regPromise = new Promise((resolve, reject) => {
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
      return this.name.toLowerCase()
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
