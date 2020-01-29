import { getInitConfig } from './index'
import { catchError } from './utils'
import { nodeProcessSend } from 'packages/shared'

async function main() {
  const { webpackConfigs, env } = await getInitConfig()

  if (env === 'development') {
    await require('./compiler-development').start(webpackConfigs)
  } else {
    await require('./compiler-production').start(webpackConfigs)
  }

  if (__TEST__ && process.send) {
    nodeProcessSend(process, { messageKey: 'exit', payload: 0 })
  }
}

main().catch(err => catchError(err))
