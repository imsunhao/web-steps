import minimist from 'minimist'
import { catchError } from './utils/error'
import { MajorCommandKey, MinorCommandKey } from './type'

export class Args {
  args: any

  /**
   * 根目录 地址
   */
  rootDir: string

  /**
   * 配置文件的相对路径
   *
   * - 配置文件 JSON 类型, 例如 web-steps.json
   */
  settingPath: string

  /**
   * 是否启用缓存
   * - 默认 启用
   */
  cache: boolean

  majorCommand: MajorCommandKey
  minorCommand: MinorCommandKey

  /// config
  /**
   * 跳过 config 编译
   */
  skipCompilerConfig: boolean
  /**
   * 强制 config 编译
   */
  forceCompilerConfig: boolean

  constructor() {
    const args: any = (this.args = minimist(process.argv.slice(2)))

    this.rootDir = args['root-dir'] || process.cwd()
    this.settingPath = args['setting-path'] || 'web-steps.json'
    this.skipCompilerConfig = args['skip-compiler-config']
    this.forceCompilerConfig = args['force-compiler-config']
    this.majorCommand = args._[0]
    this.cache = args.cache !== 'false'
  }
}

const args = new Args()

export function start() {
  async function main() {
    // const minorCommand = args.majorCommand
    const majorCommand = args.majorCommand
    if (majorCommand) {
      require(`./${majorCommand}.js`).start(args)
    }
  }

  main().catch(err => catchError(err))
}
