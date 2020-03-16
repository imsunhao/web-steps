import { ServerStart } from './type'
import { log } from '.'
import { DevService, DevAPP } from './utils/dev'
import { SSRMessageBus } from '@types'
import { Stats } from 'webpack'
import chokidar from 'chokidar'

export function showWebpackCompilerError(stats: Stats) {
  if (stats.hasWarnings()) {
    stats.compilation.warnings.forEach(warning => {
      log.warn(warning.message)
    })
  }
  if (stats.hasErrors()) {
    stats.compilation.errors.forEach(error => {
      log.log(error.message)
    })
    return false
  }
  return true
}

export function start({ server, setting, dll, credentials }: ServerStart, opts?: { messageBus: SSRMessageBus }) {
  const { messageBus } = opts
  const service = new DevService(server, setting, new DevAPP(), dll, credentials)

  messageBus.on('memory-fs', ({ mfs }) => {
    service.fileSystem = mfs
  })

  messageBus.on('config', ({ config }) => {
    service.config = config
  })

  messageBus.on('SSR-compiler', ({ compiler, webpackConfig: { name, output: { publicPath } } }) => {
    if (name === 'life-cycle') {
      service.server.lifeCycle = {} as any
      const lifeCycleWatching = compiler.watch({}, (err, stats) => {
        if (showWebpackCompilerError(stats)) {
          service.updateLifeCycle()
        }
      })
      service.compilersWatching.push(lifeCycleWatching)
    } else if (name === 'client') {
      service.lifeCycle.devMiddleware = APP => {
        const devMiddleware = require('webpack-dev-middleware')(compiler, {
          publicPath,
          noInfo: true,
          logLevel: 'warn',
          fs: service.fileSystem,
          writeToDisk: false
        })
        APP.use(devMiddleware)
        service.compilersWatching.push(devMiddleware.context.watching)
        APP.use(require('webpack-hot-middleware')(compiler, { heartbeat: 5000 }))
      }
      compiler.plugin('done', stats => {
        if (showWebpackCompilerError(stats)) {
          service.SSR.clientManifest = true
          service.updateBundleRenderer('clientManifest')
        }
      })
    } else if (name === 'server') {
      service.start()
      const serverWatching = compiler.watch({}, (err, stats) => {
        if (showWebpackCompilerError(stats)) {
          service.SSR.bundle = true
          service.updateBundleRenderer('bundle')
        }
      })
      service.compilersWatching.push(serverWatching)

      if (server.render.templatePath) {
        const templateWatching = chokidar.watch(server.render.templatePath).on('change', () => {
          service.updateBundleRenderer('template')
        })
        service.compilersWatching.push(templateWatching)
      }
    } else if (name === 'inject-context') {
      const injectContextWatching = compiler.watch({}, (err, stats) => {
        if (showWebpackCompilerError(stats)) {
          service.updateInjectContext()
        }
      })
      service.compilersWatching.push(injectContextWatching)
    }
  })

  process.addListener('beforeExit', () => {
    service.close()
  })
}

export * from './type'
