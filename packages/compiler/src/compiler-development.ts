import { getCompiler } from './utils'
import webpack from 'webpack'
import { log } from './'
import { SSRMessageBus } from '@types'
import MFS from 'memory-fs'

const mfs = new MFS()

function compiling(webpackConfig: webpack.Configuration, opts: { messageBus?: SSRMessageBus } = {}) {
  if (webpackConfig.name) {
    const compiler = getCompiler(webpackConfig)
    compiler.outputFileSystem = mfs
    opts.messageBus.emit('SSR-compiler', { compiler, webpackConfig })
  }
}

export async function start(webpackConfigs: webpack.Configuration[], opts: { messageBus?: SSRMessageBus } = {}) {
  log.info('[compiler] development mode')
  async function main() {
    opts.messageBus.emit('memory-fs', { mfs })
    for (let i = 0; i < webpackConfigs.length; i++) {
      const webpackConfig = webpackConfigs[i]
      compiling(webpackConfig, opts)
    }
  }
  await main().catch(e => log.catchError(e))
}
