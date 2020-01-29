import { Args } from '@types'
import { existsSync, readFileSync } from 'fs'
import path from 'path'
import requireFromString from 'require-from-string'
import { TSetting, TConfig, TOptionsInject } from './type'
import { getError, catchError } from './utils/error'
import { nodeProcessSend } from 'packages/shared'

const defaultSetting: Partial<TSetting> = {
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

  async getConfig() {
    if (!this.isInit) throw getError('Config need init first. try await config.init()')
  }

  async init(args: Args) {
    if (this.isInit) return
    this.args = args
    this.isInit = true
    const main = async () => {
      this.getConfigFile()
      this.getUserConfig()
    }

    return await main().catch(catchError)
  }

  async exportStatic() {
    const main = async () => {}
    return await main().catch(catchError)
  }

  /**
   * 获取配置文件
   */
  private getConfigFile() {
    const settingPath = this.resolve(this.args.config)
    let setting: TSetting
    if (existsSync(settingPath)) {
      const jsonString = readFileSync(settingPath, { encoding: 'utf-8' })
      const config = JSON.parse(jsonString)

      setting = Object.keys(config).reduce(
        (configFile, key: keyof TSetting) => {
          configFile[key] = this.resolve(config[key] || defaultSetting[key])
          return configFile
        },
        {} as TSetting
      )
    } else {
      setting = defaultSetting as any
    }
    this.setting = setting
  }

  private async getUserConfig() {
    const userConfigCachePath = this.resolve(this.setting.cache, 'config.js')
    if (existsSync(userConfigCachePath)) {
      const source = readFileSync(userConfigCachePath, 'utf-8')
      this.configConstructor = requireFromString(source, userConfigCachePath)
    }

    this.config = this.configConstructor({})

    if (__TEST__) {
      nodeProcessSend(process, {
        messageKey: 'getUserConfig',
        payload: this.config
      })
    }
  }
}

export const config = new Config()

export * from './type'
