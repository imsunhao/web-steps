import minimist from 'minimist'
import { catchError } from './utils/error'
import { MinorCommandKey } from './type'

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
  config: string

  minorCommand: MinorCommandKey

  isHelp: boolean

  constructor() {
    const args: any = (this.args = minimist(process.argv.slice(2)))

    this.rootDir = args['root-dir'] || process.cwd()
    this.config = args.config || 'web-steps.json'
    this.minorCommand = args._[0]
    this.isHelp = args.help || args.h
  }
}

const args = new Args()

export function start() {
  async function main() {
    const minorCommand = args.minorCommand
    if (minorCommand) {
      require(`./${minorCommand}.js`).start(args)
    }
  }

  main().catch(err => catchError(err))
}
