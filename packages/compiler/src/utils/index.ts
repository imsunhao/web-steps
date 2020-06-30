import webpack from 'webpack'

import { processSend } from 'shared/node'
import { log } from '../'

export function compilerDone(stats: webpack.Stats, resolve: any, reject: any, webpackConfig: webpack.Configuration) {
  log.success('compilerDone')
  if (__TEST__ && process.send) {
    processSend(process, { key: 'output', payload: { name: webpackConfig.name } })
  }
  if (stats.hasErrors()) {
    reject(stats)
  } else {
    resolve(stats)
  }
}

export function showWebpackCompilerError(stats: webpack.Stats) {
  if (stats.hasWarnings()) {
    stats.compilation.warnings.forEach(warning => {
      log.warn(warning.message)
    })
  }
  if (stats.hasErrors()) {
    stats.compilation.errors.forEach(error => {
      log.log(error.message)
    })
    log.error('编译错误.')
  }
}

export function showStats(stats: webpack.Stats) {
  log.log(stats.toString({ all: false, assets: true, colors: true }))
  showWebpackCompilerError(stats)
}

export function showCompilerStart(config: webpack.Configuration) {
  log.log('Working Compiler:', config.name || '未命名', 'by', config.mode || 'mode 为 undefined!', '\n')
}

export * from './config'
