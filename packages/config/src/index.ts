import { Args } from '@types'
import webpack from 'webpack'
import webpackMerge from 'webpack-merge'
import { existsSync, writeFileSync, unlinkSync } from 'fs'
import fs from 'fs'
import path from 'path'
import { TSetting, TConfig, TOptionsInject, StartupOptions, TGetConfigPayload } from './type'

import {
  processSend,
  mergeBase,
  cloneDeep,
  merge,
  Log,
  requireFromPath,
  convertObjToSource,
  ensureDirectoryExistence,
  requireSourceString,
  getCache,
  getSetting
} from 'packages/shared'
import { sync as rmrfSync } from 'rimraf'

import getConfigWebpackConfig from './webpack/default-config.webpack'
import getDllWebpackConfig from './webpack/default-dll.webpack'
import getDefaultBaseWebpackConfig from './webpack/default-base.webpack'
import getDefaultClientWebpackConfig from './webpack/default-client.webpack'
import defaultServerWebpackConfig from './webpack/default-server.webpack'
import { ServerLifeCycle } from '@web-steps/server'

export let log: Log

export class Config {
  private isInit = false
  /**
   * 启动参数
   */
  args: Args

  setting: TSetting

  config: TConfig

  get isDev() {
    return this.args.env === 'development'
  }

  get startupOptions(): StartupOptions {
    const bind = (fn: any) => (fn instanceof Function ? fn.bind(this) : fn)
    const keys: Array<keyof Config> = ['resolve', 'args'] // 需要考虑 getExportConfig, startConfig
    const startupOptions: Partial<StartupOptions> = {}

    return keys.reduce(
      (startupOptions, key) => {
        startupOptions[key] = bind(this[key])
        return startupOptions
      },
      startupOptions as any
    )
  }

  get userConfigPath() {
    return {
      config: this.resolve(this.setting.cache, 'config.js'),
      lifeCycle: this.resolve(this.setting.cache, 'life-cycle.js'),
      DLLManifest: this.resolve(this.setting.cache, 'vue-ssr-dll-manifest.json'),
      FILESManifest: this.resolve(this.setting.output, 'files-manifest.json'),
      startConfig: this.resolve(this.setting.output, 'start-config.js')
    }
  }

  private userConfigConstructor: (inject: TOptionsInject) => TConfig
  private userDLLManifest?: any
  private userLifeCycleConstructor: (inject: TOptionsInject) => Required<ServerLifeCycle>

  private getDefaultLifeCycleConfigWebpackConfig() {
    const lifeCycle: string = this.config.src.SSR.server.lifeCycle as any
    if (!fs.existsSync(lifeCycle) && !fs.existsSync(lifeCycle + '.ts') && !fs.existsSync(lifeCycle + '.js')) return
    return getConfigWebpackConfig('life-cycle', lifeCycle, this.setting.cache)
  }

  private async compiler(payload: TGetConfigPayload) {
    let skipLifeCycle = false
    if (payload.target === 'base') {
      const defaultConfigWebpackConfig = getConfigWebpackConfig('config', this.setting.entry, this.setting.cache)
      await require('@web-steps/compiler').start(
        {
          webpackConfigs: [defaultConfigWebpackConfig],
          env: 'production'
        },
        { notTestExit: true }
      )
    } else if (payload.target === 'dll') {
      const VUE_SSR_DLL_MANIFEST: any = {
        publicPath: '',
        all: []
      }
      const DLL = this.config.src.DLL
      const keys = Object.keys(DLL)
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i]
        let item = DLL[key]
        if (typeof item === 'string') {
          item = DLL[key] = { name: item }
        }
        item.refs = item.refs || []

        const entry = { [key]: [item.name] }
        const refs = item.refs.reduce(
          (obj, ref) => {
            obj[ref] = requireFromPath(path.resolve(this.setting.output, `${ref}.manifest.json`))
            return obj
          },
          {} as any
        )
        const defaultDllConfigWebpackConfig = getDllWebpackConfig({
          entry,
          outputPath: this.setting.output,
          context: this.config.rootDir,
          refs
        })
        const statsList: webpack.Stats[] = await require('@web-steps/compiler').start(
          {
            webpackConfigs: [defaultDllConfigWebpackConfig],
            env: 'production'
          },
          { notTestExit: true }
        )
        const stats = statsList[0]
        VUE_SSR_DLL_MANIFEST.all = VUE_SSR_DLL_MANIFEST.all.concat(Object.keys(stats.compilation.assets))
      }

      fs.writeFileSync(this.userConfigPath.DLLManifest, JSON.stringify(VUE_SSR_DLL_MANIFEST, null, 2), 'utf-8')
    } else if (!this.isDev && payload.target === 'SSR') {
      const defaultLifeCycleConfigWebpackConfig = this.getDefaultLifeCycleConfigWebpackConfig()
      if (defaultLifeCycleConfigWebpackConfig) {
        await require('@web-steps/compiler').start(
          {
            webpackConfigs: [defaultLifeCycleConfigWebpackConfig],
            env: 'production'
          },
          { notTestExit: true }
        )
      } else {
        skipLifeCycle = true
      }
    }

    if (!this.getUserConfigFromCache(payload, { skipLifeCycle }))
      return log.error('[compilerConfig] 无法在 cache 中找到 配置文件')

    if (__TEST__) {
      processSend(process, {
        messageKey: 'cache',
        payload: payload.target
      })
    }
  }

  private getUserConfigFromCache(payload: TGetConfigPayload, { skipLifeCycle }: Record<string, boolean> = {}) {
    const { config, lifeCycle, DLLManifest } = this.userConfigPath
    try {
      if (payload.target === 'base') {
        this.userConfigConstructor = requireFromPath(config)
      } else if (payload.target === 'dll') {
        this.userDLLManifest = requireFromPath(DLLManifest)
        Object.keys(this.config.src.DLL).forEach(key => {
          const manifestPath = path.resolve(this.setting.output, `${key}.manifest.json`)
          if (!fs.existsSync(manifestPath)) throw 'false'
        })
      } else if (!skipLifeCycle && !this.isDev && payload.target === 'SSR') {
        this.userLifeCycleConstructor = requireFromPath(lifeCycle)
      }
      return true
    } catch (e) {
      return false
    }
  }

  private async getConfig(payload: TGetConfigPayload) {
    if (this.args.forceCompilerConfig) {
      await this.compiler(payload)
    } else if (this.getUserConfigFromCache(payload)) {
    } else if (!this.args.skipCompilerConfig) {
      await this.compiler(payload)
    }

    if (payload.target === 'base') {
      this.stuffConfig({
        defaultBaseWebpackConfig: getDefaultBaseWebpackConfig(this.startupOptions, this.config),
        defaultClientWebpackConfig: getDefaultClientWebpackConfig(this.startupOptions, this.config),
        defaultServerWebpackConfig
      })
      if (!this.userConfigConstructor) {
        log.error('无法找到配置文件')
      }
    } else if (payload.target === 'dll') {
      this.stuffConfigByDll(this.userDLLManifest)
    } else if (payload.target === 'SSR') {
      this.stuffServer()
    }
  }

  private stuffConfig(defaultWebpackConfig: any) {
    const { defaultClientWebpackConfig, defaultServerWebpackConfig, defaultBaseWebpackConfig } = defaultWebpackConfig
    this.config = this.userConfigConstructor(this.startupOptions)
    const target = this.startupOptions.args.target
    const resolve = this.startupOptions.resolve

    if (!this.config.rootDir) {
      this.config.rootDir = this.startupOptions.args.rootDir
    }

    if (!this.config['common-asset']) {
      this.config['common-asset'] = {
        path: resolve('./common-asset')
      }
    }

    if (!this.config.public) {
      this.config.public = {
        path: resolve('./public')
      }
    }

    if (!this.config.injectContext) this.config.injectContext = resolve('./inject-context.js')

    if (this.config.customBuild) {
      this.config.customBuild = this.config.customBuild.map(webpackConfig => {
        return webpackConfig instanceof Function ? webpackConfig(this.startupOptions, this.config) : webpackConfig
      })
    }

    if (!this.config.src) this.config.src = {} as any

    if (target === 'SSR') {
      if (!this.config.src.SSR) this.config.src.SSR = {} as any
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

        const baseWebpackConfig = webpackMerge(defaultBaseWebpackConfig, result.base, {
          output: {
            path: this.setting.output
          }
        })

        SSR.base.webpack = baseWebpackConfig
        SSR.client.webpack = webpackMerge(baseWebpackConfig, defaultClientWebpackConfig, result.client)
        if (this.isDev) {
          const clientConfig = SSR.client.webpack
          const addWebpackHotMiddleware = () => {
            const getEntry = (entry: string | string[] | webpack.Entry | webpack.EntryFunc) => {
              if (typeof entry === 'string') entry = [entry]
              if (entry instanceof Array) {
                // 'eventsource-polyfill' IE 支持
                entry.unshift('webpack-hot-middleware/client')
                return entry
              }
              return false
            }
            const entry = getEntry(clientConfig.entry)
            if (entry) {
              clientConfig.entry = entry
            } else if (clientConfig.entry instanceof Function) {
              log.error('config 目前不支持 clientConfig.entry instanceof Function')
            } else {
              const configEntry: webpack.Entry = clientConfig.entry as any
              clientConfig.entry = Object.keys(clientConfig.entry).reduce(
                (entry, key) => {
                  entry[key] = getEntry(configEntry[key])
                  return entry
                },
                {} as any
              )
            }
            clientConfig.plugins.push(new webpack.HotModuleReplacementPlugin())
          }

          addWebpackHotMiddleware()

          clientConfig.output.filename = '[id].[name].[hash:5].js'
        }
        SSR.server.webpack = webpackMerge(baseWebpackConfig, defaultServerWebpackConfig, result.server)
      }
      const stuffServer = () => {
        if (!SSR.server.lifeCycle) SSR.server.lifeCycle = resolve('server/life-cycle')
      }

      stuffWebpack()
      stuffServer()
    }
  }

  private stuffConfigByDll(userDLLManifest: any) {
    if (!this.config.src.DLL) return

    Object.keys(this.config.src.DLL).forEach(key => {
      const manifestPath = path.resolve(this.setting.output, `${key}.manifest.json`)
      const manifest = requireFromPath(manifestPath)
      this.config.src.SSR.client.webpack.plugins.push(
        new webpack.DllReferencePlugin({
          context: this.config.rootDir || '',
          manifest,
          name: manifest.name
        })
      )
    })
    this.config.src.DLL = userDLLManifest.all
  }

  private stuffServer() {
    const SSR = this.config.src.SSR
    if (!this.isDev) {
      if (this.userLifeCycleConstructor) {
        SSR.server.lifeCycle = this.userLifeCycleConstructor(this.startupOptions)
      } else {
        SSR.server.lifeCycle = {} as any
      }
    } else {
      const defaultLifeCycleConfigWebpackConfig: any = this.getDefaultLifeCycleConfigWebpackConfig()
      SSR.server.lifeCycle = defaultLifeCycleConfigWebpackConfig || ({} as any)
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

  private getExportConfig() {
    const {
      args,
      setting,
      stuffConfig,
      userConfigPath: userConfigCachePath,
      isDev,
      stuffServer,
      stuffConfigByDll,
      getDefaultLifeCycleConfigWebpackConfig,
      userDLLManifest
    } = this
    delete args.args

    let userConfigConstructor = requireSourceString(userConfigCachePath.config)
    userConfigConstructor = userConfigConstructor.replace(/^module.exports =/, '')
    userConfigConstructor = userConfigConstructor.replace(/;$/, '')

    let userLifeCycleConstructor = undefined
    if (!isDev) {
      try {
        userLifeCycleConstructor = requireSourceString(userConfigCachePath.lifeCycle)
        userLifeCycleConstructor = userLifeCycleConstructor.replace(/^module.exports =/, '')
        userLifeCycleConstructor = userLifeCycleConstructor.replace(/;$/, '')
        userLifeCycleConstructor += '.default'
      } catch (e) {}
    }

    const code = `
      const webpack = require('webpack')
      const path = require('path')
      const path__default = path
      const fs__default = require('fs')
      const requireFromString = require('require-from-string')
      const requireSourceString = ${requireSourceString}
      const requireFromPath = ${requireFromPath}
      const webpackMerge = require('webpack-merge')
      const merge = ${merge}
      const mergeBase = ${mergeBase}
      const cloneDeep = ${cloneDeep}
      const { base, client, server } = require('@web-steps/config/dist/get-default-webpack-config')
      const { args, setting, isDev } = ${convertObjToSource({ args, setting, isDev })}
      const resolve = function resolve(...paths) {
        return path.resolve.apply(undefined, [args.rootDir, ...paths])
      }
      const context = { startupOptions: { args, resolve }, isDev, setting }
      context.userConfigConstructor = ${userConfigConstructor}.default
      context.userLifeCycleConstructor = ${userLifeCycleConstructor}
      const stuffConfig = function ${convertObjToSource(stuffConfig)}
      const stuffConfigByDll = function ${stuffConfigByDll}
      const stuffServer = function ${convertObjToSource(stuffServer)}
      context.getDefaultLifeCycleConfigWebpackConfig = function ${convertObjToSource(
        getDefaultLifeCycleConfigWebpackConfig
      )}

      stuffConfig.call(context, {
        defaultBaseWebpackConfig: base.default(context.startupOptions, { args }),
        defaultClientWebpackConfig: client.default(context.startupOptions, { args }),
        defaultServerWebpackConfig: server
      })

      stuffConfigByDll.call(context, ${convertObjToSource(userDLLManifest)})

      stuffServer.call(context)

      delete context.config.src.SSR.base

      module.exports = { config: context.config, args, setting }
    `
    try {
      return require('prettier').format(code, {
        parser: 'babylon'
      })
    } catch (error) {
      return code
    }
  }

  resolve(...args: string[]): string {
    if (!this.isInit) log.error('Config need init first. try await config.init()')
    return path.resolve.apply(undefined, [this.args.rootDir, ...args])
  }

  async init(args: Args, opts: { getSettingCallBack?: (config: Config) => void } = {}) {
    if (this.isInit) return
    this.args = args
    this.isInit = true
    log = new Log('config', args)
    const main = async () => {
      this.setting = getSetting(this.args, this.resolve.bind(this))
      if (opts.getSettingCallBack) opts.getSettingCallBack(this)
      if (!getCache(args)) {
        log.info('清空 缓存:', this.setting.cache)
        rmrfSync(this.setting.cache)
      }
      await this.getConfig({ target: 'base' })
      if (this.config.src.DLL) {
        await this.getConfig({ target: 'dll' })
      }
      await this.getConfig({ target: args.target })

      if (__TEST__) {
        processSend(process, {
          messageKey: 'config',
          payload: this.config
        })
      }
    }

    return await main().catch(e => log.catchError(e))
  }

  exportStatic() {
    if (!this.isInit) throw log.error('Config need init first. try await config.init()')
    const exportPath = path.resolve(this.setting.output, 'export_config.js')
    ensureDirectoryExistence(exportPath)
    if (existsSync(exportPath)) unlinkSync(exportPath)
    writeFileSync(exportPath, this.getExportConfig(), { encoding: 'utf-8', flag: 'w' })
    log.success('export config = ' + exportPath)
    if (__TEST__) {
      processSend(process, { messageKey: 'EXPORT_CONFIG' })
    }
  }
}

export const config = new Config()

export const defaultTemplatePath = ''

export * from './type'
