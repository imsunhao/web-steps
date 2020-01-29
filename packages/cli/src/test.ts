import { Args } from '@types'
import { config } from '@web-steps/config'
import { catchError } from './utils/error'

export function start(args: Args) {
  async function main() {
    await config.init(args)
  }
  main().catch(err => catchError(err))
}
