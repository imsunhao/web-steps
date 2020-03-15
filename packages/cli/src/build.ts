/* eslint-disable @typescript-eslint/prefer-string-starts-ends-with */
import { Stats } from 'webpack'
import { Args, TStartConfig, TFILES_MANIFEST, ProcessMessage } from '@types'
import { config, TConfig } from '@web-steps/config'
import { log } from './'
import { start as compilerStart } from '@web-steps/compiler'
import { sync as rmrfSync } from 'rimraf'
import {
  getCache,
  cloneDeep,
  ensureDirectoryExistence,
  requireSourceString,
  requireFromPath,
  convertObjToSource,
  getResolve,
  getDirFilesPath,
  processSend,
  processOnMessage
} from 'packages/shared'
import { writeFileSync, existsSync } from 'fs'
import path from 'path'

function pathResolve(
  server: TConfig['src']['SSR']['server'],
  resolve: (p: string) => string,
  getReplacePath: (p: string, resolve: any) => string | false
) {
  if (server.exclude) {
    server.exclude = server.exclude.map(exclude => {
      if (typeof exclude !== 'string' && 'module' in exclude && typeof exclude.replace === 'string') {
        const path = getReplacePath(exclude.replace, resolve)
        if (path) {
          exclude.replace = path
        }
      }
      return exclude
    })
  }

  if (server.statics) {
    Object.keys(server.statics).reduce((statics, key) => {
      if (statics[key]) {
        const path = getReplacePath(statics[key].path, resolve)
        if (path) {
          statics[key].path = path
        }
      }
      return statics
    }, server.statics)
  }

  if (server.render) {
    Object.keys(server.render).reduce((render, key: keyof typeof server.render) => {
      if (render[key]) {
        const path = getReplacePath(render[key], resolve)
        if (path) render[key] = path
      }
      return render
    }, server.render)
  }
}

function exportSSRStartConfig(DLL: any, injectContext: any) {
  const server = cloneDeep(config.config.src.SSR.server)
  const replaceRegExp = /^#replace#/

  const getReplacePath = (p: string, resolve: any) => {
    if (replaceRegExp.test(p)) {
      return resolve(p.replace(replaceRegExp, ''))
    }
    return false
  }

  const setReplacePath = (p: string, resolve: any) => {
    if (/^\//.test(p)) {
      return '#replace#' + resolve(p)
    }
    return false
  }

  if (existsSync(config.userConfigPath.lifeCycle)) {
    server.lifeCycle = requireSourceString(config.userConfigPath.lifeCycle) as any
  } else {
    delete server.lifeCycle
  }

  pathResolve(server, p => path.relative(config.args.rootDir, p), setReplacePath)

  delete server.webpack

  const startConfig: Partial<TStartConfig> = {
    server,
    DLL,
    injectContext
  }

  function getStartConfigJs() {
    const code = `
      const path = require('path')
      const rootDir = path.resolve(__dirname, '${path.relative(config.setting.output, config.args.rootDir)}')
      const getResolve = ${convertObjToSource(getResolve)}
      const resolve = getResolve({ rootDir })
      const { server, DLL, injectContext } = ${convertObjToSource(startConfig)}
      const pathResolve = ${pathResolve}
      const getReplacePath = ${getReplacePath}
      const replaceRegExp = ${replaceRegExp}

      pathResolve(server, resolve, getReplacePath)

      module.exports = {
        resolve,
        rootDir,
        server,
        DLL,
        injectContext
      }
    `
    try {
      return require('prettier').format(code, {
        parser: 'babylon'
      })
    } catch (error) {
      return code
    }
  }

  ensureDirectoryExistence(config.userConfigPath.startConfig)

  writeFileSync(config.userConfigPath.startConfig, getStartConfigJs(), {
    encoding: 'utf-8',
    flag: 'w'
  })
  log.info('export SSR StartConfig success!\n    path =', config.userConfigPath.startConfig)
}

export function start(args: Args) {
  async function main() {
    args.env = 'production'
    const env = args.env

    await config.init(args, {
      getSettingCallBack(c: any) {
        if (!getCache(args)) {
          log.info('清空 输出目录:', c.setting.output)
          rmrfSync(c.setting.output)
        }
      }
    })

    const rootDir = config.args.rootDir
    const relative = (to: string) => {
      return path.relative(rootDir, to)
    }

    const FILES_MANIFEST: TFILES_MANIFEST = {
      base: [relative(config.userConfigPath.startConfig)],
      dll: [],
      SSR: [],
      template: [],
      public: [],
      'common-assets': []
    }

    const injectContextConfig: any = config.config.injectContext

    let injectContext: any

    if (injectContextConfig) {
      await compilerStart(
        {
          webpackConfigs: [injectContextConfig],
          env
        },
        { notTestExit: true }
      )
      injectContext = requireFromPath(path.resolve(config.setting.cache, 'inject-context.js'))
    }

    const DLL: string[] = config.config.src.DLL as any
    if (DLL) {
      FILES_MANIFEST.dll = DLL.map(dll => relative(path.resolve(config.setting.output, dll)))
    }

    const getStaticFilePath = (key: keyof TConfig & keyof TFILES_MANIFEST) => {
      const dirOption = config.config[key]
      const dirPath = dirOption.path
      const filePathList = getDirFilesPath(dirPath, dirOption)
      if (filePathList) {
        FILES_MANIFEST[key] = filePathList.map(filePath => relative(filePath))
      } else {
        log.warn(`[Static Dir] 未找到 ${key}`)
      }
    }

    getStaticFilePath('public')
    getStaticFilePath('common-assets')

    if (args.target === 'SSR') {
      const SSR = config.config.src.SSR
      exportSSRStartConfig(DLL, injectContext)
      const statsList: Stats[] = await compilerStart(
        {
          webpackConfigs: [SSR.client.webpack, SSR.server.webpack],
          env
        },
        { notTestExit: true }
      )

      const templatePath = SSR.server.render.templatePath
      if (templatePath) {
        FILES_MANIFEST.template.push(relative(templatePath))
      }

      statsList.forEach(stats => {
        FILES_MANIFEST.SSR = FILES_MANIFEST.SSR.concat(
          Object.keys(stats.compilation.assets).map(asset => relative(path.resolve(config.setting.output, asset)))
        )
      })
    }

    writeFileSync(config.userConfigPath.FILESManifest, JSON.stringify(FILES_MANIFEST, null, 2), 'utf-8')

    if (!('send' in process) || !__TEST__) {
    } else {
      processSend(process, { messageKey: 'build' })
      processOnMessage(process, (payload: ProcessMessage) => {
        log.debug(log.packagePrefix, 'process', payload.messageKey)
        if (payload.messageKey === 'exit') {
          process.exit(0)
        }
      })
    }
  }
  main().catch(e => log.catchError(e))
}
