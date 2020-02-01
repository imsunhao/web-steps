import { ServerStart } from './type'
import { log } from '.'
import { initServer } from './utils'

export async function start({ lifeCycle, render }: ServerStart) {
  async function main() {
    initServer(lifeCycle, render)
  }

  await main().catch(err => log.catchError(err))
}

export * from './type'
