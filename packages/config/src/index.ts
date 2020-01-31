import { Args } from '@types'
import webpackMerge from 'webpack-merge'
import { existsSync, readFileSync } from 'fs'
import path from 'path'
import requireFromString from 'require-from-string'
import { TSetting, TConfig, TOptionsInject, StartupOptions } from './type'

import { processSend, merge, Log } from 'packages/shared'
import { sync as rmrfSync } from 'rimraf'

import getConfigWebpackConfig from './webpack/default-config.webpack.js'
import getDefaultBaseWebpackConfig from './webpack/default-base.webpack.js'
import defaultClientWebpackConfig from './webpack/default-client.webpack.js'
import defaultServerWebpackConfig from './webpack/default-server.webpack.js'

const defaultSetting: TSetting = {
  entry: 'web-steps.ts',
  output: 'dist/web-steps',
  injectContext: '',
  cache: 'node_modules/.web-steps_cache'
}

export let log: Log

export class Config {
  private isInit = false
  /**
   * 启动参数
   */
  args: Args

  setting: TSetting

  config: TConfig

  get startupOptions(): StartupOptions {
    const bind = (fn: any) => (fn instanceof Function ? fn.bind(this) : fn)
    const keys: Array<keyof Config> = ['resolve', 'args']
    const startupOptions: Partial<StartupOptions> = {}

    return keys.reduce(
      (startupOptions, key) => {
        startupOptions[key] = bind(this[key])
        return startupOptions
      },
      (startupOptions as any) as StartupOptions
    )
  }

  private userConfigConstructor: (inject: TOptionsInject) => TConfig

  /**
   * 获取配置文件
   */
  private getSetting() {
    const settingPath = this.resolve(this.args.settingPath)
    let setting: TSetting = defaultSetting
    if (existsSync(settingPath)) {
      const jsonString = readFileSync(settingPath, { encoding: 'utf-8' })
      setting = merge({}, defaultSetting, JSON.parse(jsonString))
    }
    this.setting = Object.keys(setting).reduce(
      (configFile, key: keyof TSetting) => {
        const path = setting[key] || defaultSetting[key]
        if (path) {
          configFile[key] = this.resolve(path)
        }
        return configFile
      },
      {} as TSetting
    )
    // console.log('[getSetting]', this.setting)
  }

  private async compilerConfig(userConfigCachePath: string) {
    const defaultConfigWebpackConfig = getConfigWebpackConfig(this.setting.entry, this.setting.cache)
    await require('@web-steps/compiler').start({
      node: false,
      webpackConfigs: [defaultConfigWebpackConfig],
      env: 'production'
    })

    this.getUserConfigFromCache(userConfigCachePath)

    if (__TEST__) {
      processSend(process, {
        messageKey: 'cache',
        payload: userConfigCachePath
      })
    }
  }

  private getUserConfigFromCache(userConfigCachePath: string) {
    const source = readFileSync(userConfigCachePath, 'utf-8')
    const md = requireFromString(source, userConfigCachePath)
    this.userConfigConstructor = md.__esModule ? md.default : md
  }

  private async getConfig() {
    const userConfigCachePath = this.resolve(this.setting.cache, 'config.js')
    if (this.args.forceCompilerConfig) {
      await this.compilerConfig(userConfigCachePath)
    } else if (existsSync(userConfigCachePath)) {
      this.getUserConfigFromCache(userConfigCachePath)
    } else if (!this.args.skipCompilerConfig) {
      await this.compilerConfig(userConfigCachePath)
    }

    if (!this.userConfigConstructor) {
      log.error(`无法找到 ${userConfigCachePath}`)
    }

    this.config = this.userConfigConstructor(this.startupOptions)

    if (this.config.customBuild) {
      this.config.customBuild = this.config.customBuild.map(webpackConfig => {
        return webpackConfig instanceof Function ? webpackConfig(this.startupOptions, this.config) : webpackConfig
      })
    }

    if (this.config.src && this.config.src.SSR) {
      const SSR = this.config.src.SSR
      const result = {
        base: {} as any,
        client: {} as any,
        server: {} as any
      }

      Object.keys(result).forEach((key: keyof typeof result) => {
        if (SSR[key]) {
          let webpackConfig: any = SSR[key].webpack
          if (webpackConfig instanceof Function) {
            webpackConfig = webpackConfig(this.startupOptions, this.config)
          }
          result[key] = webpackConfig || {}
        } else {
          SSR[key] = { webpack: {} } as any
        }
      })

      const baseWebpackConfig = webpackMerge(getDefaultBaseWebpackConfig(this.startupOptions, this.config), result.base)

      SSR.base.webpack = baseWebpackConfig
      SSR.client.webpack = webpackMerge(baseWebpackConfig, defaultClientWebpackConfig, result.client)
      SSR.server.webpack = webpackMerge(baseWebpackConfig, defaultServerWebpackConfig, result.server)
    }

    if (__TEST__) {
      processSend(process, {
        messageKey: 'config',
        payload: this.config
      })
    }
  }

  resolve(...args: string[]) {
    if (!this.isInit) log.error('Config need init first. try await config.init()')
    return path.resolve.apply(undefined, [this.args.rootDir, ...args])
  }

  async init(args: Args) {
    if (this.isInit) return
    this.args = args
    this.isInit = true
    log = new Log('config', args)
    const main = async () => {
      this.getSetting()
      if (!args.cache) {
        log.info('清空缓存')
        rmrfSync(this.setting.cache)
      }
      await this.getConfig()
    }

    return await main().catch(log.catchError)
  }

  async exportStatic() {
    if (!this.isInit) throw log.error('Config need init first. try await config.init()')
    const main = async () => {}
    return await main().catch(log.catchError)
  }
}

export const config = new Config()

export * from './type'
