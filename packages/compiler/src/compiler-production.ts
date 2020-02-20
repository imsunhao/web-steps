import { getCompiler, compilerDone, showStats } from './utils'
import webpack from 'webpack'
import { log } from './'

function compiling(webpackConfig: any) {
  let resolve: any
  let reject: any
  const p = new Promise<webpack.Stats>((r, j) => {
    resolve = r
    reject = j
  })

  const compiler = getCompiler(webpackConfig)
  compiler.plugin('done', stats => compilerDone(stats, resolve, reject, webpackConfig))
  compiler.run((err, stats) => showStats(stats))
  return p
}

export async function start(webpackConfigs: webpack.Configuration[]) {
  log.info('[compiler] production mode')

  async function main() {
    const result: webpack.Stats[] = []
    for (let i = 0; i < webpackConfigs.length; i++) {
      const webpackConfig = webpackConfigs[i]
      result.push(await compiling(webpackConfig))
    }
    return result
  }

  try {
    return await main()
  } catch (e) {
    log.catchError(e)
  }
}
