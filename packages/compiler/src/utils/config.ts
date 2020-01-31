import minimist from 'minimist'
import { readFileSync, existsSync } from 'fs'
import webpack, { Configuration } from 'webpack'
import requireFromString from 'require-from-string'
import { getProcessMessageMap, ProcessMessageMap } from 'packages/shared'

import { log } from '../'
import { showCompilerStart } from './'

const localArgs = minimist(process.argv.slice(2))

export class Args {
  get args(): any {
    if (processMessageMap.args) return processMessageMap.args.args
    return localArgs
  }

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
  get target(): 'SSR-server' | 'SSR-client' | 'SSR' | 'custom' {
    return this.args.target
  }

  /**
   * 环境变量
   * - 内容发生变化 需要同步考虑 src/index.ts
   */
  get env(): 'production' | 'development' {
    return this.args.env || process.env.NODE_ENV || 'production'
  }
}

export const args = new Args()

let processMessageMap: ProcessMessageMap = {} as any

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

export async function getInitConfig() {
  let webpackConfigs: Configuration[] = []
  let node = !args.webpackPath
  if (args.webpackPath) {
    webpackConfigs = [new WebpackConfig()]
  } else {
    try {
      processMessageMap = await getProcessMessageMap()

      switch (args.target) {
        case 'SSR-server':
          webpackConfigs = [processMessageMap.config.src.SSR.server.webpack]
          break
        case 'SSR-client':
          webpackConfigs = [processMessageMap.config.src.SSR.client.webpack]
          break
        case 'SSR':
          webpackConfigs = [
            processMessageMap.config.src.SSR.client.webpack,
            processMessageMap.config.src.SSR.server.webpack
          ]
          break
        case 'custom':
          webpackConfigs = processMessageMap.config.customBuild
          break
      }
    } catch (error) {
      log.error('未能找到 webpack config. 请确保 webpackPath 存在 或者 使用 yarn web-step compiler 编译.')
    }
  }

  return {
    node,
    webpackConfigs
  }
}

export type CompilerConfig = SniffPromise<ReturnType<typeof getInitConfig>> & { env: Args['env'] }

/**
 * 获取 webpack Compiler
 * @param config webpack 配置文件
 */
export function getCompiler(config: webpack.Configuration) {
  showCompilerStart(config)
  return webpack(config)
}
