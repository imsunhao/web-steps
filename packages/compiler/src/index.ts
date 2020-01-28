import minimist from 'minimist'
import { readFileSync, existsSync } from 'fs'
import webpack, { Configuration } from 'webpack'
import requireFromString from 'require-from-string'

import { getProcessMessageMap, ProcessMessageMap } from 'packages/shared'
import { showCompilerStart, getError } from './utils'

// import { catchError } from './utils/error'
// import { ProcessMessage } from '@types'

export class Args {
  args: any

  /**
   * Webpack 配置地址
   * - 文件类型为 JavaScript
   * - 编码格式 utf-8
   */
  get webpackPath(): string {
    return this.args['webpack-path']
  }

  /**
   * 编译目标
   */
  get target(): 'SSR-server' | 'SSR-client' | 'SSR' {
    return this.args.target
  }

  constructor() {
    this.args = minimist(process.argv.slice(2))
  }
}

let webpackConfigs: Configuration[] = []
let processMessageMap: ProcessMessageMap

const args = new Args()

class WebpackConfig implements Configuration {
  constructor() {
    if (existsSync(args.webpackPath)) {
      const source = readFileSync(args.webpackPath, 'utf-8')
      const config = requireFromString(source, args.webpackPath)
      Object.keys(config).forEach(key => {
        ;(this as any)[key] = config[key]
      })
    }
  }
}

export async function getProcessMessage() {
  processMessageMap = await getProcessMessageMap()
  switch (args.target) {
    case 'SSR-server':
      webpackConfigs = [processMessageMap.config.src.SSRWebpack.server]
      break
    case 'SSR-client':
      webpackConfigs = [processMessageMap.config.src.SSRWebpack.client]
      break
    case 'SSR':
      webpackConfigs = [processMessageMap.config.src.SSRWebpack.client, processMessageMap.config.src.SSRWebpack.server]
      break
    default:
      break
  }
}

export async function getWebpackConfigs() {
  if (args.webpackPath) {
    webpackConfigs = [new WebpackConfig()]
  } else {
    try {
      await getProcessMessage()
    } catch (error) {
      throw getError('未能找到 webpack config. 请确保 webpackPath 存在 或者 使用 yarn web-step compiler 编译.')
    }
  }
  if (__TEST__ && process.send) {
    process.send({
      name: 'webpackConfig',
      payload: webpackConfigs
    })
  }
  return webpackConfigs
}

/**
 * 获取 webpack Compiler
 * @param config webpack 配置文件
 */
export function getCompiler(config: webpack.Configuration) {
  showCompilerStart(config)
  return webpack(config)
}

export function compilerDone(stats: webpack.Stats, resolve: any, reject: any) {
  console.log('compilerDone')
  if (stats.hasErrors()) {
    reject(stats)
  } else {
    resolve(stats)
  }
  if (__TEST__ && process.send) {
    process.send({ name: 'output' })
  }
}
