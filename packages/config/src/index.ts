import { Args } from '@types'
import { existsSync, readFileSync } from 'fs'
import path from 'path'
import requireFromString from 'require-from-string'
import { TSetting, TConfig, TOptionsInject } from './type'
import { getError, catchError } from './utils/error'
import { nodeProcessSend, merge } from 'packages/shared'
import { sync as rmrfSync } from 'rimraf'
import getConfigWebpackConfig from './webpack/default-config.webpack.js'

const defaultSetting: TSetting = {
  entry: 'web-steps.ts',
  output: 'dist/web-steps',
  injectContext: '',
  cache: 'node_modules/.web-steps_cache'
}

export class Config {
  private isInit = false
  /**
   * 启动参数
   */
  private args: Args

  setting: TSetting
  config: TConfig
  configConstructor: (inject: TOptionsInject) => TConfig

  resolve(...args: string[]) {
    if (!this.isInit) throw getError('Config need init first. try await config.init()')
    return path.resolve.apply(undefined, [this.args.rootDir, ...args])
  }

  async init(args: Args) {
    if (this.isInit) return
    this.args = args
    this.isInit = true
    const main = async () => {
      this.getSetting()
      if (!args.cache) {
        console.log('清空缓存')
        rmrfSync(this.setting.cache)
      }
      this.getConfig()
    }

    return await main().catch(catchError)
  }

  async exportStatic() {
    if (!this.isInit) throw getError('Config need init first. try await config.init()')
    const main = async () => {}
    return await main().catch(catchError)
  }

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
    console.log('-----------[compilerConfig]-----------')
    const defaultConfigWebpackConfig = getConfigWebpackConfig(this.setting.entry, this.setting.cache)
    await require('@web-steps/compiler').start({
      webpackConfigs: [defaultConfigWebpackConfig],
      env: 'production'
    })
    await this.getConfigConstructor(userConfigCachePath)

    if (__TEST__) {
      nodeProcessSend(process, {
        messageKey: 'cache',
        payload: userConfigCachePath
      })
    }
  }

  private async getConfigConstructor(userConfigCachePath: string) {
    const source = readFileSync(userConfigCachePath, 'utf-8')
    const md = requireFromString(source, userConfigCachePath)
    this.configConstructor = md.__esModule ? md.default : md
  }

  private async getConfig() {
    const userConfigCachePath = this.resolve(this.setting.cache, 'config.js')
    if (this.args.forceCompilerConfig) {
      await this.compilerConfig(userConfigCachePath)
    } else if (existsSync(userConfigCachePath)) {
      await this.getConfigConstructor(userConfigCachePath)
    } else if (!this.args.skipCompilerConfig) {
      await this.compilerConfig(userConfigCachePath)
    }

    if (!this.configConstructor) {
      throw getError(`无法找到 ${userConfigCachePath}`)
    }

    this.config = this.configConstructor({})

    if (__TEST__) {
      nodeProcessSend(process, {
        messageKey: 'config',
        payload: this.config
      })
    }
  }
}

export const config = new Config()

export * from './type'
