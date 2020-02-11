import { ServerStart } from './type'
import { log } from '.'
import { Service } from './utils'

export async function start({ server, setting }: ServerStart) {
  async function main() {
    const service = new Service(server, setting)
    service.start()

    process.addListener('beforeExit', () => {
      service.close()
    })
  }

  await main().catch(err => log.catchError(err))
}

export * from './type'
