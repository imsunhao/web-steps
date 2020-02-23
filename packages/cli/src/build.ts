import { Args, TStartConfig } from '@types'
import { config } from '@web-steps/config'
import { log } from './'
import { start as compilerStart } from '@web-steps/compiler'
import { sync as rmrfSync } from 'rimraf'
import {
  getCache,
  cloneDeep,
  ensureDirectoryExistence,
  requireSourceString,
  convertObjToSource,
  getResolve
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

    if (args.target === 'SSR') {
      const SSR = config.config.src.SSR
      await exportSSRStartConfig()
      await compilerStart({
        webpackConfigs: [SSR.client.webpack, SSR.server.webpack],
        env
      })
    }
  }
  main().catch(e => log.catchError(e))
}

async function exportSSRStartConfig() {
  const DLL = config.config.src.DLL

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
      return require('prettier').format(code)
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
