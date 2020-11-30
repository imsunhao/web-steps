import { ServerStart } from './type'
import { Service, APP } from './utils'

export function start({ server, setting, dll, injectContext, port, INJECT_ENV }: ServerStart) {
  process.env.PORT = port as string
  Service.updateInjectContext(injectContext)
  Service.updateInjectENV(INJECT_ENV)

  const service = new Service(server, setting, new APP(), dll)
  service.start()

  process.addListener('beforeExit', () => {
    service.close()
  })
}

export * from './type'
