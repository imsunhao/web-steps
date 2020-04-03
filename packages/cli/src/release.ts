import { Args } from '@types'
import { log } from './'

import { start as releaseStart } from '@web-steps/release'

export function start(args: Args) {
  async function main() {
    args.env = 'production'
    await releaseStart(args)
  }
  main().catch(e => log.catchError(e))
}
