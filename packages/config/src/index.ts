// eslint-disable-next-line no-var
export var defaultTemplatePath = ''

import { Args } from '@types'
import webpack from 'webpack'
import webpackMerge from 'webpack-merge'
import { existsSync, writeFileSync, unlinkSync } from 'fs'
import fs from 'fs'
import path from 'path'
import { TSetting, TConfig, TOptionsInject, StartupOptions, TGetConfigPayload } from './type'

import { Log } from 'packages/shared'
import { processSend } from 'shared/node'
import { mergeBase, cloneDeep, merge } from 'shared/lodash'
import { requireFromPath, requireSourceString } from 'shared/require'
import { getCache, getSetting } from 'shared/config'
import { ensureDirectoryExistence } from 'shared/fs'
import { convertObjToSource } from 'shared/toString'
import { sync as rmrfSync } from 'rimraf'

import getConfigWebpackConfig from './webpack/default-config.webpack'
import getDllWebpackConfig from './webpack/default-dll.webpack'
import getDefaultBaseWebpackConfig from './webpack/default-base.webpack'
import getDefaultClientWebpackConfig from './webpack/default-client.webpack'
import getDefaultServerWebpackConfig from './webpack/default-server.webpack'
import { Execa } from '@web-steps/cli'
import { ServerLifeCycle } from '@web-steps/server'
import { DEFAULT_PORT, DEFAULT_OPENSSL_CONFIG, DEFAULT_V3_EXT_CONFIG, HTTPS_README } from './setting'

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
      this.stuffConfig(
        {
          getDefaultBaseWebpackConfig,
          getDefaultClientWebpackConfig,
          getDefaultServerWebpackConfig
        },
        DEFAULT_PORT
      )
      if (!this.userConfigConstructor) {
        log.error('无法找到配置文件')
      }
      if (this.isDev) {
        if (!this.config.dev) this.config.dev = { https: false }
        if (this.config.dev.https) {
          let certificate = this.config.dev.credentials as any
          let hasCredentials = true
          if (!this.config.dev.credentials) {
            certificate = this.resolve('./certificate')
          }
          this.config.dev.credentials = {
            key: this.resolve(certificate, './web-steps.key'),
            csr: this.resolve(certificate, './web-steps.pem'),
            cert: this.resolve(certificate, './web-steps.crt'),
            ca: [this.resolve(certificate, './CA.pem')]
          }
          if (!this.config.dev.cnf) this.config.dev.cnf = this.resolve(certificate, './openssl.cnf')
          if (!this.config.dev.ext) this.config.dev.ext = this.resolve(certificate, './v3.cnf')

          if (!fs.existsSync(this.config.dev.credentials.key)) hasCredentials = false
          if (!fs.existsSync(this.config.dev.credentials.cert)) hasCredentials = false

          /**
           * 命令
           * openssl genrsa -out CA.key 2048
           * openssl req -x509 -new -nodes -key CA.key -sha256 -days 1024 -config openssl.cnf -out CA.pem
           * openssl req -new -newkey rsa:2048 -sha256 -nodes -keyout web-steps.key -config openssl.cnf -out web-steps.csr
           * openssl x509 -sha256 -req -in web-steps.csr -CA CA.pem -CAkey CA.key -CAcreateserial -days 1024 -extfile v3.cnf -out web-steps.crt
           *
           * sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain web-steps.crt
           */
          if (!hasCredentials) {
            ensureDirectoryExistence(this.config.dev.credentials.key)

            if (!fs.existsSync(this.config.dev.cnf)) {
              fs.writeFileSync(this.config.dev.cnf, DEFAULT_OPENSSL_CONFIG, {
                encoding: 'utf-8',
                flag: 'w'
              })
            }
            if (!fs.existsSync(this.config.dev.ext)) {
              fs.writeFileSync(this.config.dev.ext, DEFAULT_V3_EXT_CONFIG, {
                encoding: 'utf-8',
                flag: 'w'
              })
            }
            const openssl = async (args: string[]) => {
              let resolve: any
              const childProcess = Execa.run('openssl', args, {
                stdio: ['inherit', 'inherit', 'inherit', 'ipc']
              })
              childProcess.on('close', code => {
                if (code) throw 'openssl error'
                resolve()
              })
              await new Promise(r => (resolve = r))
            }
            const {
              key,
              csr,
              cert,
              ca: [ca]
            } = this.config.dev.credentials
            const cnf = this.config.dev.cnf
            const ext = this.config.dev.ext
            const days = '3650'
            const caKey = this.resolve(certificate, './CA.key')
            try {
              await openssl(['genrsa', '-out', caKey, '2048'])
              await openssl([
                'req',
                '-x509',
                '-new',
                '-nodes',
                '-key',
                caKey,
                '-sha256',
                '-days',
                days,
                '-config',
                cnf,
                '-out',
                ca
              ])
              await openssl([
                'req',
                '-new',
                '-nodes',
                '-newkey',
                'rsa:2048',
                '-sha256',
                '-keyout',
                key,
                '-config',
                cnf,
                '-out',
                csr
              ])
              await openssl([
                'x509',
                '-sha256',
                '-req',
                '-in',
                csr,
                '-CA',
                ca,
                '-CAkey',
                caKey,
                '-CAcreateserial',
                '-days',
                days,
                '-extfile',
                ext,
                '-out',
                cert
              ])
              fs.writeFileSync(
                this.resolve(certificate, './README.md'),
                HTTPS_README(path.relative(this.args.rootDir, ca), path.relative(this.args.rootDir, cert)),
                {
                  encoding: 'utf-8',
                  flag: 'w'
                }
              )
              log.info(`[HTTPS] 证书已经自动安装, 请阅读 ${certificate} 下的 README.md`)
            } catch (error) {
              log.error(error)
            }
          }

          this.config.dev.credentials = {
            key: requireSourceString(this.config.dev.credentials.key),
            csr: '',
            cert: requireSourceString(this.config.dev.credentials.cert),
            ca: [requireSourceString(this.config.dev.credentials.ca[0])]
          }
        }
      }
    } else if (payload.target === 'dll') {
      this.stuffConfigByDll(this.userDLLManifest, requireFromPath)
    } else if (payload.target === 'SSR') {
      this.stuffServer(merge)
    }
  }

  private stuffConfig(defaultWebpackConfig: any, DEFAULT_PORT: number) {
    this.config = this.userConfigConstructor(this.startupOptions)

    const target = this.startupOptions.args.target
    const resolve: (p: string) => string = this.startupOptions.resolve

    if (!this.config.rootDir) {
      this.config.rootDir = this.startupOptions.args.rootDir
    }

    if (!this.config.static) {
      this.config.static = {
        path: resolve('./static')
      }
    }

    if (!this.config.public) {
      this.config.public = {
        path: resolve('./public')
      }
    }

    if (this.startupOptions.args.injectContext) {
      const injectContextPath = this.startupOptions.args.injectContext
      this.config.injectContext = injectContextPath.startsWith('/') ? injectContextPath : resolve(injectContextPath)
    } else if (!this.config.injectContext) this.config.injectContext = resolve('./inject-context.ts')

    if (fs.existsSync(this.config.injectContext)) {
      this.config.injectContext = getConfigWebpackConfig(
        'inject-context',
        this.config.injectContext,
        this.setting.cache
      ) as any
    } else {
      this.config.injectContext = undefined
    }

    if (this.config.customBuild) {
      this.config.customBuild = this.config.customBuild.map(webpackConfig => {
        return webpackConfig instanceof Function ? webpackConfig(this.startupOptions, this.config) : webpackConfig
      })
    }

    if (!this.config.src) this.config.src = {} as any

    this.config.port = this.startupOptions.args.port || process.env.PORT || this.config.port || DEFAULT_PORT
    process.env.PORT = this.config.port as any

    if (target === 'SSR') {
      if (!this.config.src.SSR) this.config.src.SSR = {} as any
      const SSR = this.config.src.SSR

      const stuffServer = () => {
        if (!SSR.client) SSR.client = {} as any
        if (!SSR.server) SSR.server = {} as any

        if (!SSR.server.lifeCycle) SSR.server.lifeCycle = resolve('server/life-cycle') as any
        if (!SSR.client.exclude) SSR.client.exclude = []
        if (!SSR.server.exclude) SSR.server.exclude = []
        if (!SSR.server.whitelist) SSR.server.whitelist = []
        SSR.server.exclude.push(
          {
            module: /\.css$/,
            exclude: true
          },
          {
            module: /\?vue&type=style/
          }
        )
        const excludeWhiteList = SSR.server.exclude.map(options => {
          return typeof options === 'string' || !('module' in options) ? options : options.module
        })
        SSR.server.whitelist = SSR.server.whitelist.concat(excludeWhiteList)
      }

      const stuffWebpack = () => {
        const {
          getDefaultBaseWebpackConfig,
          getDefaultClientWebpackConfig,
          getDefaultServerWebpackConfig
        } = defaultWebpackConfig
        const defaultBaseWebpackConfig = getDefaultBaseWebpackConfig(this.startupOptions, this.config)
        const defaultClientWebpackConfig = getDefaultClientWebpackConfig(this.startupOptions, this.config)
        const defaultServerWebpackConfig = getDefaultServerWebpackConfig(this.startupOptions, this.config)

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

      stuffServer()
      stuffWebpack()
    }
  }

  private stuffConfigByDll(userDLLManifest: any, requireFromPath: any) {
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

  private stuffServer(merge: any) {
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
      const DEFAULT_PORT = ${DEFAULT_PORT}
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
      const nodeExternals = require('webpack-node-externals')
      const getConfigWebpackConfig = ${getConfigWebpackConfig}
      context.getDefaultLifeCycleConfigWebpackConfig = function ${convertObjToSource(
        getDefaultLifeCycleConfigWebpackConfig
      )}

      stuffConfig.call(context, {
        getDefaultBaseWebpackConfig: base.default,
        getDefaultClientWebpackConfig: client.default,
        getDefaultServerWebpackConfig: server.default
      }, DEFAULT_PORT)

      stuffConfigByDll.call(context, ${convertObjToSource(userDLLManifest)}, requireFromPath)

      stuffServer.call(context, merge)

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

  relative(to: string) {
    return path.relative(this.args.rootDir, to)
  }

  async init(args: Args, opts: { afterGetSetting?: (config: Config) => void } = {}) {
    if (this.isInit) return
    this.args = args
    this.isInit = true
    log = new Log('config', args)
    const main = async () => {
      this.setting = getSetting(this.args, this.resolve.bind(this))
      if (opts.afterGetSetting) opts.afterGetSetting(this)
      if (!getCache(args)) {
        log.info('清空 缓存目录:', this.setting.cache)
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

export * from './type'
export * from './setting'
