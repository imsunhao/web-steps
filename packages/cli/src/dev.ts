import { log } from './'
import { config } from '@web-steps/config'
import { Args, ProcessMessage, TSSRMessageBus } from '@types'
import { processOnMessage, MessageBus } from 'packages/shared'
import { start as serverStart } from '@web-steps/server'
import { start as compilerStart } from '@web-steps/compiler'

export function start(args: Args) {
  async function main() {
    args.env = 'development'
    const env = args.env

    await config.init(args)

    if (args.target === 'SSR') {
      const messageBus = new MessageBus<TSSRMessageBus>()
      const { src, injectContext, port } = config.config
      const SSR = src.SSR
      serverStart(
        {
          server: SSR.server,
          setting: config.setting,
          dll: src.DLL,
          injectContext: undefined,
          port,
          env
        },
        { messageBus }
      )
      compilerStart(
        {
          webpackConfigs: [injectContext as any, SSR.server.lifeCycle as any, SSR.client.webpack, SSR.server.webpack],
          env
        },
        { messageBus }
      )
      messageBus.emit('config', { config })
    }

    if (!('send' in process) || !__TEST__) {
    } else {
      processOnMessage(process, (payload: ProcessMessage) => {
        log.debug(log.packagePrefix, 'process', payload.messageKey)
        if (payload.messageKey === 'e2e') {
          process.exit(0)
        }
      })
    }

    await new Promise(r => {})
  }
  main().catch(e => log.catchError(e))
}
