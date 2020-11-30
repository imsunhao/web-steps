import { Args, TStartConfig, ProcessMessage } from '@types'
import { log } from './'
import path from 'path'
import { processOnMessage } from 'shared/node'
import { requireFromPath } from 'shared/require'
import { getSetting } from 'shared/config'
import { start as serverStart } from '@web-steps/server'
import requireFromString from 'require-from-string'
import { StartupOptions } from '@web-steps/config'
import { COMMON_HELPER_INFO } from 'shared/setting'
import { checkHelper } from 'shared/log'

const helperInfo = `
- ENV (可接受-环境变量)
  PORT:                  启动端口号 string | number
                         - 最高优先级
${COMMON_HELPER_INFO}
- UNIQUE
  port:                  启动端口号 string | number
                         - 优先级 仅低于 ENV 中 PORT
`

function requrieFromString(source: string) {
  try {
    const ex = requireFromString(source)
    return ex && typeof ex === 'object' && 'default' in ex ? ex['default'] : ex
  } catch (error) {
    log.error(`[requrieFromString] error\nsource = ${source}\nerror = ${error}`)
  }
}

export function start(args: Args) {
  checkHelper(args, {
    majorCommand: {
      name: 'start',
      info: helperInfo
    },
    minorCommand: []
  })

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

  const { DLL, injectContext, port, INJECT_ENV } = startConfig as any

  if (args.target === 'SSR') {
    serverStart({
      server,
      setting,
      dll: DLL,
      credentials: undefined,
      injectContext,
      INJECT_ENV,
      port: process.env.PORT || args.port || port,
      env: args.env
    })
  }

  if (!('send' in process) || !__TEST__) {
  } else {
    processOnMessage(process, (payload: ProcessMessage) => {
      log.debug(log.packagePrefix, 'process', payload.key)
      if (payload.key === 'e2e') {
        process.exit(0)
      }
    })
  }
}
