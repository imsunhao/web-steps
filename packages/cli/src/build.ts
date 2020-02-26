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
  convertObjToSource,
  getResolve,
  getDirFilesPath,
  processSend,
  processOnMessage
} from 'packages/shared'
import { writeFileSync, existsSync } from 'fs'
import path from 'path'

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
      'common-asset': []
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
    getStaticFilePath('common-asset')

    if (args.target === 'SSR') {
      const SSR = config.config.src.SSR
      await exportSSRStartConfig(DLL)
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

    if (!process.send || !__TEST__) {
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

async function exportSSRStartConfig(DLL: any) {
  const server = cloneDeep(config.config.src.SSR.server)
  if (existsSync(config.userConfigPath.lifeCycle)) {
    server.lifeCycle = requireSourceString(config.userConfigPath.lifeCycle) as any
  } else {
    delete server.lifeCycle
  }

  Object.keys(server.render).reduce((render, key: keyof typeof server.render) => {
    if (render[key]) render[key] = path.relative(config.args.rootDir, render[key])
    return render
  }, server.render)

  delete server.webpack

  const startConfig: Partial<TStartConfig> = {
    server,
    DLL
  }

  function getStartConfigJs() {
    const code = `
      const path = require('path')
      const rootDir = path.resolve(__dirname, '${path.relative(config.setting.output, config.args.rootDir)}')
      const getResolve = ${convertObjToSource(getResolve)}
      const resolve = getResolve({ rootDir })
      const { server, DLL } = ${convertObjToSource(startConfig)}

      Object.keys(server.render).reduce((render, key) => {
        if (render[key]) render[key] = resolve(render[key])
        return render
      }, server.render)

      module.exports = {
        resolve,
        rootDir,
        server,
        DLL
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
