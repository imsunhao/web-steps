import { ServerStart } from './type'
import { log } from '.'
import { Service, APP } from './utils'

export async function start({ server, setting, dll }: ServerStart) {
  async function main() {
    const service = new Service(server, setting, new APP(), dll)
    service.start()

    process.addListener('beforeExit', () => {
      service.close()
    })
  }

  await main().catch(err => log.catchError(err))
}

export * from './type'
