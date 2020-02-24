import { Args, TStartConfig, ProcessMessage } from '@types'
import { log } from './'
import path from 'path'
import { getSetting, requireFromPath, processOnMessage } from 'packages/shared'
import { start as serverStart } from '@web-steps/server'
import requireFromString from 'require-from-string'
import { StartupOptions } from '@web-steps/config'

export function start(args: Args) {
  async function main() {
    args.env = 'production'

    const setting = getSetting(args)

    const startConfig: TStartConfig = requireFromPath(path.resolve(setting.output, 'start-config.js'))

    const server = startConfig.server

    if (server.lifeCycle) {
      const startupOptions: StartupOptions = { args, resolve: startConfig.resolve }
      server.lifeCycle = requrieFromString(server.lifeCycle)(startupOptions)
    }

    if (args.target === 'SSR') {
      serverStart({
        server,
        setting,
        dll: startConfig.DLL,
        env: args.env
      })
    }

    if (!process.send || !__TEST__) {
    } else {
      processOnMessage(process, (payload: ProcessMessage) => {
        log.debug(log.packagePrefix, 'process', payload.messageKey)
        if (payload.messageKey === 'e2e') {
          process.exit(0)
        }
      })
    }
  }
  main().catch(e => log.catchError(e))
}

function requrieFromString(source: string) {
  try {
    const ex = requireFromString(source)
    return ex && typeof ex === 'object' && 'default' in ex ? ex['default'] : ex
  } catch (error) {
    log.error(`[requrieFromString] ${path} not find!`)
  }
}
