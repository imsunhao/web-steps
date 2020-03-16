import { Args, TStartConfig, ProcessMessage } from '@types'
import { log } from './'
import path from 'path'
import { getSetting, requireFromPath, processOnMessage } from 'packages/shared'
import { start as serverStart } from '@web-steps/server'
import requireFromString from 'require-from-string'
import { StartupOptions } from '@web-steps/config'

function requrieFromString(source: string) {
  try {
    const ex = requireFromString(source)
    return ex && typeof ex === 'object' && 'default' in ex ? ex['default'] : ex
  } catch (error) {
    log.error(`[requrieFromString] ${path} not find!`)
  }
}

export function start(args: Args) {
  args.env = 'production'

  const setting = getSetting(args)

  const startConfig: TStartConfig = requireFromPath(path.resolve(setting.output, 'start-config.js'))

  const server = startConfig.server

  if (server.lifeCycle) {
    const startupOptions: StartupOptions = { args, resolve: startConfig.resolve }
    server.lifeCycle = requrieFromString(server.lifeCycle)(startupOptions)
  } else {
    server.lifeCycle = {}
  }

  const { DLL, injectContext, port } = startConfig as any

  if (args.target === 'SSR') {
    serverStart({
      server,
      setting,
      dll: DLL,
      credentials: undefined,
      injectContext,
      port,
      env: args.env
    })
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
}
