import execa from 'execa'
import minimist from 'minimist'
import { config } from '@web-steps/config'

const isDebug = !!process.env.DEBUG_PORT

class Run {
  private debug = isDebug ? new Debug() : undefined

  run(bin: string, args: string[] = [], opts: execa.Options<string> = {}) {
    return execa(bin, args, { stdio: 'inherit', ...opts })
  }

  runNode(args: string[] = [], opts: execa.Options<string> = {}) {
    args = this.debug ? this.debug.getDebugArgs(args) : args
    return this.run('node', args, opts)
  }
}

class Debug {
  private get port() {
    return parseInt(process.env.DEBUG_PORT || '-1')
  }

  private setPort(port: number) {
    process.env.DEBUG_PORT = port + ''
  }

  getDebugArgs(args: string[] = []) {
    const port = this.port
    this.setPort(port + 1)
    return [`--inspect-brk=${port}`, ...args]
  }
}

export class Args {
  args: any

  get rootDir(): string {
    return this.args.rootDir || process.cwd()
  }

  constructor() {
    this.args = minimist(process.argv.slice(2))
  }
}

const run = new Run()
const args = new Args()

async function main() {
  await config.init(args)
  await run.runNode(['packages/cli/dist/dev.js', `--config=${config.path}`])
}

export function start() {
  main().catch(err => {
    console.error(err)
  })
}
