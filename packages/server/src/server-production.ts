import { ServerStart } from './type'
import { Service, APP } from './utils'

export function start({ server, setting, dll }: ServerStart) {
  const service = new Service(server, setting, new APP(), dll)
  service.start()

  process.addListener('beforeExit', () => {
    service.close()
  })
}

export * from './type'
