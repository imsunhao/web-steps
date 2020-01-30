import { getInitConfig, CompilerConfig } from './index'
import { catchError } from './utils'
import { nodeProcessSend } from 'packages/shared'

export async function start(payload?: CompilerConfig) {
  async function main() {
    const { webpackConfigs, env, node } = payload || (await getInitConfig())

    if (env === 'development') {
      await require('./compiler-development').start(webpackConfigs)
    } else {
      await require('./compiler-production').start(webpackConfigs)
    }

    if (node && __TEST__ && process.send) {
      nodeProcessSend(process, {
        messageKey: 'exit',
        payload: {
          name: 'compiler',
          code: 0
        }
      })
    }
  }

  await main().catch(err => catchError(err))
}
