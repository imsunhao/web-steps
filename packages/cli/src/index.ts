import execa from 'execa'
import minimist from 'minimist'
import { config } from '@web-steps/config'

export class Run {
  run(bin: string, args: string[] = [], opts: execa.Options<string> = {}) {
    return execa(bin, args, { env: process.env, stdio: 'inherit', ...opts })
  }

  runNode(args: string[] = [], opts: execa.Options<string> = {}) {
    args = __DEBUG__ ? [`--inspect-brk=${__DEBUG_PORT__}`] : args
    return this.run('node', args, opts)
  }

  /**
   * 启用 Nodejs 并使用 IPC 进程通讯
   */
  runNodeIPC(args: string[] = [], opts: execa.Options<string> = {}) {
    return this.runNode(args, { stdio: ['inherit', 'inherit', 'inherit', 'ipc'], ...opts })
  }
}

export class Args {
  args: any

  /**
   * 根目录 地址
   */
  get rootDir(): string {
    return this.args['root-dir'] || process.cwd()
  }

  /**
   * 配置文件的相对路径
   *
   * - 配置文件 JSON 类型, 例如 web-steps.json
   */
  get config(): string {
    return this.args.config || 'web-steps.json'
  }

  constructor() {
    this.args = minimist(process.argv.slice(2))
  }
}

const run = new Run()
const args = new Args()

async function main() {
  await config.init(args)
  await run.runNode(['packages/cli/dist/dev.js'])
}

export function start() {
  main().catch(err => {
    console.error(err)
  })
}
