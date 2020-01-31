import { getInitConfig, CompilerConfig } from './utils'
import { processSend, Log } from 'packages/shared'

export let log: Log

export async function start(payload?: CompilerConfig) {
  async function main() {
    const env: any = payload ? payload.env : process.env.NODE_ENV || 'production'
    log = new Log('compiler', { env })
    const { webpackConfigs, node } = payload || (await getInitConfig())

    if (env === 'development') {
      await require('./compiler-development').start(webpackConfigs)
    } else {
      await require('./compiler-production').start(webpackConfigs)
    }

    if (node && __TEST__) {
      processSend(process, {
        messageKey: 'exit',
        payload: {
          name: 'compiler',
          code: 0
        }
      })
    }
  }

  await main().catch(log.catchError)
}
