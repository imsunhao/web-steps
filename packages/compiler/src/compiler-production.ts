import { getWebpackConfigs, getCompiler, compilerDone } from './index'
import { catchError, showStats } from './utils'
import webpack from 'webpack'

function compiling(webpackConfig: webpack.Configuration) {
  let resolve: any
  let reject: any
  const p = new Promise<webpack.Stats>((r, j) => {
    resolve = r
    reject = j
  })
  const compiler = getCompiler(webpackConfig)
  compiler.plugin('done', stats => compilerDone(stats, resolve, reject))
  compiler.run((err, stats) => showStats(stats))
  return p
}

function start() {
  async function main() {
    const webpackConfigs = await getWebpackConfigs()
    webpackConfigs.forEach(async webpackConfig => {
      await compiling(webpackConfig)
    })
  }
  main().catch(err => catchError(err))
}

start()
