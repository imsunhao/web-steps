import { Args } from '@types'
import { config } from '@web-steps/config'
import { log } from './'

export function start(args: Args) {
  async function main() {
    await config.init(args)
    if (args.majorCommand === 'config' && args.minorCommand === 'export') {
      await config.exportStatic()
    }
  }
  main().catch(e => log.catchError(e))
}
