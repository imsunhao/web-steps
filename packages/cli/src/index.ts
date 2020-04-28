import { Args } from './utils'
import { Log, checkHelper } from 'shared/log'

const args = new Args()

export const log = new Log('cli', args)

export function start() {
  const majorCommand = args.majorCommand
  log.log(`\n\n[${majorCommand || 'cli'}]`, 'v' + require('@web-steps/cli/package.json').version, '\n')
  if (majorCommand) {
    require(`./${majorCommand}.js`).start(args)
  } else {
    checkHelper(args)
  }
}

export * from './type'
export * from './utils'
