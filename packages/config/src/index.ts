import { Args } from '@types'
import { existsSync, readFileSync } from 'fs'
import path from 'path'
import requireFromString from 'require-from-string'

function getError(message: string) {
  return new Error('[@web-steps/config] ' + message)
}

function catchError(error: Error) {
  console.error(error)
  process.exit(1)
}

export type UserConfig = {
  /**
   * 测试 专用字段
   * - 单元测试
   * - 用户设置此字段无意义,如果想审查用户配置,请导出静态配置
   */
  test?: string
}

export type GetUserConfig = (startupOptions: any) => UserConfig

export type TSetting = {
  /**
   * 项目 入口
   * - 默认值 web-steps.ts
   */
  entry: string

  /**
   * 项目输出目录
   * - 默认值 dist/web-steps
   */
  output: string

  /**
   * 注入自定义数据
   * - 注入的上下文 配置文件目录
   * - 没有默认值
   */
  injectContext: string

  /**
   * 缓存目录
   * - 存放配置文件
   * - 默认值 node_modules/web-steps_cache
   */
  cache: string
}

export type TConfig = {}

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
      const souce = readFileSync(userConfigCachePath, 'utf-8')
      this.config = requireFromString(souce)
    }

    if (__TEST__) {
      console.log('has process.send ', !!process.send)
      if (process.send) {
        process.send({
          name: 'getUserConfig',
          data: this.config
        })
      }
    }
  }
}

export const config = new Config()
