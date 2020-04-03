import minimist from 'minimist'
import { MajorCommandKey, MinorCommandKey } from '../type'

export class Args {
  args: any

  /**
   * 根目录 地址
   */
  rootDir: string

  /**
   * 注入自定义数据 路径
   */
  injectContext: string

  /**
   * server运行端口号
   * - 默认值 8080
   */
  port: string

  /**
   * 配置文件的相对路径
   *
   * - 配置文件 JSON 类型, 例如 web-steps.json
   */
  settingPath: string

  majorCommand: MajorCommandKey
  minorCommand: MinorCommandKey

  /**
   * 系统运行
   */
  env: 'production' | 'development'

  /**
   * 目标
   */
  target: 'SSR-server' | 'SSR-client' | 'SSR' | 'custom'

  /// config
  /**
   * 跳过 config 编译
   */
  skipCompilerConfig: boolean
  /**
   * 强制 config 编译
   */
  forceCompilerConfig: boolean

  /// release

  /**
   * 跳过 test检查
   */
  skipTests: boolean

  /**
   * 跳过 打包
   */
  skipBuild: boolean

  constructor() {
    const args: any = (this.args = minimist(process.argv.slice(2), { boolean: ['skip-build', 'skip-tests'] }))

    this.rootDir = args['root-dir'] || process.cwd()
    this.injectContext = args['inject-context']
    this.settingPath = args['setting-path'] || 'web-steps.json'
    this.skipCompilerConfig = args['skip-compiler-config']
    this.forceCompilerConfig = args['force-compiler-config']
    args._ = args._.filter((arg: any) => !!arg)
    this.majorCommand = args._[0]
    this.minorCommand = args._[1]
    this.env = args.env || process.env.NODE_ENV || 'production'

    this.target = this.args.target || 'SSR'

    this.skipBuild = args['skip-build']
    this.skipTests = args['skip-tests']
  }
}

export * from './node'
