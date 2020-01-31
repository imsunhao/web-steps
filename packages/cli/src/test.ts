import { Args } from '@types'
import { config } from '@web-steps/config'
import { log } from './'

export function start(args: Args) {
  async function main() {
    await config.init(args)
  }
  main().catch(log.catchError)
}
