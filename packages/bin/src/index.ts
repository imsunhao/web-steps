import execa from 'execa'
// import { TConfig } from '@web-steps/config'
type TConfig = any

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
  private get debugPort() {
    return parseInt(process.env.DEBUG_PORT || '-1')
  }

  private setDebugPort(port: number) {
    process.env.DEBUG_PORT = port + ''
  }

  getDebugArgs(args: string[] = []) {
    const port = this.debugPort
    this.setDebugPort(port + 1)
    return [`--inspect-brk=${port}`, ...args]
  }
}

class Config {
  config: TConfig
  init() {
    this.config = require('@web-steps/config').start()
  }
}

const run = new Run()
const config = new Config()

async function main() {
  config.init()
  await run.runNode(['packages/bin/dist/dev.js'])
}

export function start() {
  main().catch(err => {
    console.error(err)
  })
}
