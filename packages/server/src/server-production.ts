import { ServerStart } from './type'
import { log } from '.'
import { initServer } from './utils'

export async function start({ server, setting }: ServerStart) {
  async function main() {
    initServer(server, setting)
  }

  await main().catch(err => log.catchError(err))
}

export * from './type'
