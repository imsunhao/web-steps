import execa from 'execa'
import { TA as devTA } from './dev'
import { TConfig } from '@web-steps/config'

export const a = '33333'

export type TA = devTA

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
