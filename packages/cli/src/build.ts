/* eslint-disable @typescript-eslint/prefer-string-starts-ends-with */
import { Stats } from 'webpack'
import { Args, TStartConfig, TFILES_MANIFEST, ProcessMessage } from '@types'
import { config, TConfig } from '@web-steps/config'
import { log } from './'
import { start as compilerStart } from '@web-steps/compiler'
import { sync as rmrfSync } from 'rimraf'
import { getCache, getResolve } from 'shared/config'
import { ensureFolderExistence, getDirFilePathList } from 'shared/fs'
import { requireSourceString, requireFromPath } from 'shared/require'
import { processSend, processOnMessage } from 'shared/node'
import { checkHelper } from 'shared/log'
import { convertObjToSource } from 'shared/toString'
import { cloneDeep } from 'shared/lodash'
import { COMMON_HELPER_INFO } from 'shared/setting'
import { writeFileSync, existsSync, readFileSync } from 'fs'
import path from 'path'

// const manifestBaseOutputPath = path.resolve(config.setting.output, 'docker')

function pathResolve(
  server: TConfig['src']['SSR']['server'],
  resolve: (p: string) => string,
  getReplacePath: (p: string, resolve: any) => string | false
) {
  if (server.exclude) {
    server.exclude = server.exclude.map((exclude: any) => {
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
    injectContext,
    port: config.config.port,
    INJECT_ENV: config.config.INJECT_ENV
  }

  function getStartConfigJs() {
    const code = `
      const path = require('path')
      const rootDir = path.resolve(__dirname, '${path.relative(config.setting.output, config.args.rootDir)}')
      const getResolve = ${convertObjToSource(getResolve)}
      const resolve = getResolve({ rootDir })
      const { server, DLL, injectContext, port, INJECT_ENV } = ${convertObjToSource(startConfig)}
      const pathResolve = ${pathResolve}
      const getReplacePath = ${getReplacePath}
      const replaceRegExp = ${replaceRegExp}

      pathResolve(server, resolve, getReplacePath)

      module.exports = {
        resolve,
        rootDir,
        server,
        DLL,
        INJECT_ENV,
        port,
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

  ensureFolderExistence(config.userConfigPath.startConfig)

  writeFileSync(config.userConfigPath.startConfig, getStartConfigJs(), {
    encoding: 'utf-8',
    flag: 'w'
  })
  log.info('export SSR StartConfig success!\n    path =', config.userConfigPath.startConfig)
}

const helperInfo = `
- ENV (可接受-环境变量)
  RELEASE:               web-stpes relase 中的 taget
                         - 根据 relase-taget 中配置, 覆盖config配置
  MODE:                  编译模式
                         - 默认 OSS上传服务器端代码, 服务端下载
                         - docker 使用 image 保存服务器端代码

${COMMON_HELPER_INFO}
- UNIQUE
  target:                编译目标
                         - 默认值 SSR
                         - 可选值 'SSR-server' | 'SSR-client' | 'SSR' | 'custom'
                         - 可选值 你在customBuild中配置的name
`

export async function start(args: Args) {
  checkHelper(args, {
    majorCommand: {
      name: 'build',
      info: helperInfo
    },
    minorCommand: []
  })
  args.env = 'production'
  const env = args.env

  try {
    await config.init(args, {
      afterGetSetting(c: any) {
        if (!getCache(args)) {
          log.info('清空 输出目录:', c.setting.output)
          rmrfSync(c.setting.output)
        }
      }
    })

    const isDocker = process.env.MODE === 'docker' || config.config.docker.enable

    if (args.target === 'SSR') {
      await SSR(isDocker)
    } else {
      await custom()
    }
  } catch (e) {
    log.catchError(e)
  }

  async function SSR(isDocker: boolean) {
    const rootDir = config.args.rootDir
    const relative = (to: string) => {
      return path.relative(rootDir, to)
    }

    const FILES_MANIFEST: TFILES_MANIFEST = {
      base: [relative(config.userConfigPath.startConfig)],
      dll: [],
      SSR: [],
      public: [],
      static: []
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
      const filePathList = getDirFilePathList(dirPath, dirOption)
      if (filePathList) {
        FILES_MANIFEST[key] = filePathList.map(filePath => relative(filePath))
      } else {
        log.warn(`[Static Dir] 未找到 ${key}`)
      }
    }

    getStaticFilePath('public')
    getStaticFilePath('static')

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
      FILES_MANIFEST.base.push(relative(templatePath))
    }

    statsList.forEach(stats => {
      FILES_MANIFEST.SSR = FILES_MANIFEST.SSR.concat(
        Object.keys(stats.compilation.assets)
          .filter(asset => !asset.includes('vue-ssr'))
          .map(asset => relative(path.resolve(config.setting.output, asset)))
      )
    })

    FILES_MANIFEST.base = FILES_MANIFEST.base.concat(
      ['vue-ssr-client-manifest.json', 'vue-ssr-server-bundle.json'].map(asset =>
        relative(path.resolve(config.setting.output, asset))
      )
    )

    if (isDocker) {
      const docker = config.config.docker
      if (!existsSync(docker.templatePath)) log.error('docker.templatePath not find!', docker.templatePath)
      let dockerFileCopyString = ''
      const getDockerFileCopyString = (p: string) => {
        return `COPY ${p} ${path.join('$workspace', p)}\n`
      }
      FILES_MANIFEST.base.forEach(path => {
        dockerFileCopyString += getDockerFileCopyString(path)
      })
      delete FILES_MANIFEST.base
      const dockerFileTemplate = readFileSync(docker.templatePath, 'utf-8')
      const dockerFile = dockerFileTemplate.replace(/# web-steps-copy-outlet/g, dockerFileCopyString)

      writeFileSync(docker.outputPath, dockerFile, 'utf-8')
    }

    writeFileSync(config.userConfigPath.FILESManifest, JSON.stringify(FILES_MANIFEST, null, 2), 'utf-8')
    debugger

    if (!('send' in process) || !__TEST__) {
    } else {
      debugger
      if (isDocker) {
        processSend(process, { key: 'docker' })
      } else {
        processSend(process, { key: 'build' })
      }
      processOnMessage(process, (payload: ProcessMessage) => {
        log.debug(log.packagePrefix, 'process', payload.key)
        if (payload.key === 'exit') {
          process.exit(0)
        }
      })
    }
  }

  async function custom() {
    let webpackConfigs = config.config.customBuild
    const SSR = config.config.src.SSR
    if (args.target === 'custom') {
      webpackConfigs = config.config.customBuild
    } else if (args.target === 'SSR-client') {
      webpackConfigs = [SSR.client.webpack]
    } else if (args.target === 'SSR-server') {
      webpackConfigs = [SSR.server.webpack]
    } else {
      const webpackCustomConfig = webpackConfigs.find(({ name }: any) => args.target === name)
      if (!webpackCustomConfig)
        log.error('[build target=custom]', `target = ${args.target}`, '未在 customBuild 列表中 找到! 请检查 name')
      webpackConfigs = [webpackCustomConfig]
    }

    await compilerStart(
      {
        webpackConfigs,
        env
      },
      { notTestExit: true }
    )
  }
}
