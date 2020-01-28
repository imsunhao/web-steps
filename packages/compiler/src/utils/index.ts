import webpack from 'webpack'
import { createErrorHandle } from 'packages/shared'

export const { getError, catchError } = createErrorHandle('compiler')

export function showWebpackCompilerError(stats: webpack.Stats) {
  if (stats.hasWarnings()) {
    stats.compilation.warnings.forEach(warning => {
      console.log(warning)
    })
  }
  if (stats.hasErrors()) {
    stats.compilation.errors.forEach(error => {
      console.log(error)
    })
    if (__PRODUCTION__) throw getError('编译错误')
  }
}

export function showStats(stats: webpack.Stats) {
  console.log(stats.toString({ colors: true, errors: false, warnings: false }))
  showWebpackCompilerError(stats)
}

export function showCompilerStart(config: webpack.Configuration) {
  console.log('Working Compiler:', config.name || '未命名', '\n')
}
