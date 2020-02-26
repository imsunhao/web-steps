import { getInitConfig, CompilerConfig } from './utils'
import { processSend, Log, getEnv } from 'packages/shared'
import { SSRMessageBus } from '@types'

const major = 'compiler'

export let log: Log
export async function start(
  payload?: CompilerConfig,
  opts: { notTestExit?: boolean; messageBus?: SSRMessageBus } = {}
) {
  const { notTestExit } = opts
  async function main() {
    const env = getEnv({ env: payload ? payload.env : __NODE_ENV__ })
    log = new Log(major, { env })
    const { webpackConfigs } = payload || (await getInitConfig())

    const result = await require(`./${major}-${env}`).start(webpackConfigs, opts)

    if (!notTestExit && __WEB_STEPS__ && __TEST__) {
      processSend(process, {
        messageKey: 'exit',
        payload: {
          name: major,
          code: 0
        }
      })
    }

    return result
  }

  try {
    return await main()
  } catch (e) {
    log.catchError(e)
  }
}
