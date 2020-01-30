import { getCompiler, compilerDone } from './index'
import { catchError, showStats } from './utils'
import webpack from 'webpack'

console.log('[compiler] production mode')

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
  async function main() {
    for (let i = 0; i < webpackConfigs.length; i++) {
      const webpackConfig = webpackConfigs[i]
      await compiling(webpackConfig)
    }
  }
  await main().catch(err => catchError(err))
}
