import { Args } from './utils'
import { Log } from 'packages/shared'

const args = new Args()

export const log = new Log('cli', args)

export function start() {
  const majorCommand = args.majorCommand
  if (majorCommand) {
    require(`./${majorCommand}.js`).start(args)
  }
}

export * from './type'
export * from './utils'
