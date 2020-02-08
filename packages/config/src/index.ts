import { Args } from '@types'
import webpackMerge from 'webpack-merge'
import { existsSync, readFileSync, writeFileSync, unlinkSync } from 'fs'
import path from 'path'
import { TSetting, TConfig, TOptionsInject, StartupOptions } from './type'

import {
  processSend,
  mergeBase,
  cloneDeep,
  merge,
  Log,
  requireFromPath,
  convertObjToSource,
  ensureDirectoryExistence,
  requireSourceString
} from 'packages/shared'
import { sync as rmrfSync } from 'rimraf'

import getConfigWebpackConfig from './webpack/default-config.webpack'
import getDefaultBaseWebpackConfig from './webpack/default-base.webpack'
import defaultClientWebpackConfig from './webpack/default-client.webpack'
import defaultServerWebpackConfig from './webpack/default-server.webpack'

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
    const keys: Array<keyof Config> = ['resolve', 'args'] // 需要考虑 getExportConfig
    const startupOptions: Partial<StartupOptions> = {}

    return keys.reduce(
      (startupOptions, key) => {
        startupOptions[key] = bind(this[key])
        return startupOptions
      },
      (startupOptions as any) as StartupOptions
    )
  }

  get userConfigCachePath() {
    return this.resolve(this.setting.cache, 'config.js')
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
    await require('@web-steps/compiler').start(
      {
        webpackConfigs: [defaultConfigWebpackConfig],
        env: 'production'
      },
      { isConfig: true }
    )

    this.getUserConfigFromCache(userConfigCachePath)

    if (__TEST__) {
      processSend(process, {
        messageKey: 'cache',
        payload: userConfigCachePath
      })
    }
  }

  private getUserConfigFromCache(userConfigCachePath: string) {
    this.userConfigConstructor = requireFromPath(userConfigCachePath)
  }

  private async getConfig() {
    const userConfigCachePath = this.userConfigCachePath
    if (this.args.forceCompilerConfig) {
      await this.compilerConfig(userConfigCachePath)
    } else if (existsSync(userConfigCachePath)) {
      this.getUserConfigFromCache(userConfigCachePath)
    } else if (!this.args.skipCompilerConfig) {
      await this.compilerConfig(userConfigCachePath)
    }

    this.stuffConfig({
      defaultBaseWebpackConfig: getDefaultBaseWebpackConfig(this.startupOptions, this.config),
      defaultClientWebpackConfig,
      defaultServerWebpackConfig
    })

    if (!this.userConfigConstructor) {
      log.error(`无法找到 ${userConfigCachePath}`)
    }

    if (__TEST__) {
      processSend(process, {
        messageKey: 'config',
        payload: this.config
      })
    }
  }

  private stuffConfig(defaultWebpackConfig: any) {
    const { defaultClientWebpackConfig, defaultServerWebpackConfig, defaultBaseWebpackConfig } = defaultWebpackConfig
    this.config = this.userConfigConstructor(this.startupOptions)

    if (this.config.customBuild) {
      this.config.customBuild = this.config.customBuild.map(webpackConfig => {
        return webpackConfig instanceof Function ? webpackConfig(this.startupOptions, this.config) : webpackConfig
      })
    }

    if (this.config.src && this.config.src.SSR) {
      const SSR = this.config.src.SSR

      const stuffWebpack = () => {
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

        const baseWebpackConfig = webpackMerge(defaultBaseWebpackConfig, result.base)

        SSR.base.webpack = baseWebpackConfig
        SSR.client.webpack = webpackMerge(baseWebpackConfig, defaultClientWebpackConfig, result.client)
        SSR.server.webpack = webpackMerge(baseWebpackConfig, defaultServerWebpackConfig, result.server)
      }

      const stuffServer = () => {
        if (SSR.server.lifeCycle) {
        } else {
          SSR.server.lifeCycle = {} as any
        }

        const outputPath: string = (SSR.server.webpack.output ? SSR.server.webpack.output.path : '') as any
        let render
        if (SSR.server.webpack.output) {
          render = {
            bundlePath: path.resolve(outputPath, 'vue-ssr-server-bundle.json'),
            clientManifestPath: path.resolve(outputPath, 'vue-ssr-client-manifest.json'),
            templatePath: ''
          }
        }
        SSR.server.render = merge(render || {}, SSR.server.render)
      }

      stuffWebpack()
      stuffServer()
    }
  }

  private getExportConfig() {
    const { args, setting, stuffConfig, userConfigCachePath } = this
    delete args.args

    let userConfigConstructor = requireSourceString(userConfigCachePath)
    userConfigConstructor = userConfigConstructor.replace(/^module.exports =/, '')
    userConfigConstructor = userConfigConstructor.replace(/;$/, '')

    const code = `
      const path = require('path')
      const webpackMerge = require('webpack-merge')
      const merge = ${merge}
      const mergeBase = ${mergeBase}
      const cloneDeep = ${cloneDeep}
      const { base, client, server } = require('@web-steps/config/dist/get-default-webpack-config')
      const { args, setting } = ${convertObjToSource({ args, setting })}
      const resolve = function resolve(...paths) {
        return path.resolve.apply(undefined, [args.rootDir, ...paths])
      }
      const context = { startupOptions: { args, resolve } }
      context.userConfigConstructor = ${userConfigConstructor}.default
      const stuffConfig = function ${convertObjToSource(stuffConfig)}
      stuffConfig.call(context, {
        defaultBaseWebpackConfig: base.default(context.startupOptions, { args }),
        defaultClientWebpackConfig: client,
        defaultServerWebpackConfig: server
      })
      delete context.config.src.SSR.base
      module.exports = { config: context.config, args, setting }
    `
    try {
      return require('prettier').format(code)
    } catch (error) {
      return code
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
    const main = async () => {
      const exportPath = path.resolve(this.setting.output, 'export_config.js')
      ensureDirectoryExistence(exportPath)
      if (existsSync(exportPath)) unlinkSync(exportPath)
      writeFileSync(exportPath, this.getExportConfig(), { encoding: 'utf-8', flag: 'w' })
      log.success('export config = ' + exportPath)
      if (__TEST__) {
        processSend(process, { messageKey: 'export_config' })
      }
    }
    return await main().catch(err => log.catchError(err))
  }
}

export const config = new Config()

export * from './type'
