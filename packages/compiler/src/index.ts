import { getInitConfig, CompilerConfig } from './utils'
import { Log } from 'shared/log'
import { processSend } from 'shared/node'
import { getEnv } from 'shared/config'
import { SSRMessageBus } from '@types'
// import threadLoader from 'thread-loader'

const major = 'compiler'

// function name(params:type) {
//   threadLoader.warmup({
//     // pool options, like passed to loader options
//     // must match loader options to boot the correct pool
//   }, [
//     // modules to load
//     // can be any module, i. e.
//     'babel-loader',
//     'babel-preset-es2015',
//     'sass-loader',
//   ])
// }

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
        key: 'exit',
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
