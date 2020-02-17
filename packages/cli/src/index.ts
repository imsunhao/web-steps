import { Args } from './utils'
import { Log } from 'packages/shared'

const args = new Args()

export const log = new Log('cli', args)

export function start() {
  async function main() {
    // const minorCommand = args.majorCommand
    const majorCommand = args.majorCommand
    if (majorCommand) {
      require(`./${majorCommand}.js`).start(args)
    }
  }

  main().catch(e => log.catchError(e))
}

export * from './type'
export * from './utils'
