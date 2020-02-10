import { getInitConfig, CompilerConfig } from './utils'
import { processSend, Log, getEnv } from 'packages/shared'
import { SSRMessageBus } from '@types'

const major = 'compiler'

export let log: Log
export async function start(payload?: CompilerConfig, opts: { isConfig?: boolean; messageBus?: SSRMessageBus } = {}) {
  const { isConfig } = opts
  async function main() {
    const env = getEnv({ env: payload ? payload.env : __NODE_ENV__ })
    log = new Log(major, { env })
    const { webpackConfigs } = payload || (await getInitConfig())

    await require(`./${major}-${env}`).start(webpackConfigs, opts)

    if (!isConfig && __WEB_STEPS__ && __TEST__) {
      processSend(process, {
        messageKey: 'exit',
        payload: {
          name: major,
          code: 0
        }
      })
    }
  }

  await main().catch(err => log.catchError(err))
}
