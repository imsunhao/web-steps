import { Args } from './utils'
import { Log } from 'shared/log'

const args = new Args()

export const log = new Log('cli', args)

export function start() {
  const majorCommand = args.majorCommand
  if (majorCommand) {
    log.log('bin', majorCommand)
    require(`./${majorCommand}.js`).start(args)
  }
}

export * from './type'
export * from './utils'
