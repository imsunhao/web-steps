import { ServerStart } from './type'
import { log } from '.'
import { Service } from './utils'
import { SSRMessageBus } from '@types'
import { createBundleRenderer } from 'vue-server-renderer'
import MFS from 'memory-fs'
import { DEFAULT_TEMPLATE } from './setting'
import { requireFromPath, processSend } from 'packages/shared'

class DevService extends Service {
  SSR = {
    clientManifest: false,
    bundle: false
  }

  fileSystem: MFS

  readFileSync(filePath: string) {
    try {
      return this.fileSystem.readFileSync(filePath, 'utf-8')
    } catch (e) {
      log.error('[readFileSync]', e)
    }
  }

  updateBundleRenderer(key: 'clientManifest' | 'bundle' | 'template') {
    const {
      render: { templatePath, clientManifestPath, bundlePath }
    } = this.server
    const requireOptions = { fs: this.fileSystem }
    if (this.SSR.bundle && this.SSR.clientManifest) {
      log.info(`updated by ${key} time: ${new Date().toLocaleString()}`)
      this.lifeCycle.renderToString = createBundleRenderer(requireFromPath(bundlePath, requireOptions), {
        inject: true,
        template: templatePath ? requireFromPath(templatePath) : DEFAULT_TEMPLATE,
        clientManifest: requireFromPath(clientManifestPath, requireOptions)
      }).renderToString
      if (__TEST__ && __WEB_STEPS__) {
        processSend(process, { messageKey: 'e2e' })
      }
    }
  }

  updateLifeCycle() {
    log.log('updateLifeCycle')
  }
}

export async function start({ server, setting }: ServerStart, opts?: { messageBus: SSRMessageBus }) {
  async function main() {
    const { messageBus } = opts
    const service = new DevService(server, setting)

    messageBus.on('memory-fs', ({ mfs }) => {
      service.fileSystem = mfs
    })

    messageBus.on('SSR-compiler', ({ compiler, webpackConfig: { name, output: { publicPath } } }) => {
      if (name === 'client') {
        service.lifeCycle.beforeStart = APP => {
          APP.use(
            require('webpack-dev-middleware')(compiler, {
              publicPath,
              noInfo: true,
              logLevel: 'warn',
              fs: service.fileSystem,
              writeToDisk: false
            })
          )
          APP.use(require('webpack-hot-middleware')(compiler, { heartbeat: 5000 }))
        }
        compiler.plugin('done', stats => {
          service.SSR.clientManifest = true
          service.updateBundleRenderer('clientManifest')
        })
        service.start()
      } else if (name === 'server') {
        compiler.watch({}, (err, stats) => {
          service.SSR.bundle = true
          service.updateBundleRenderer('bundle')
        })
      } else if (name === 'life-cycle') {
        service.updateLifeCycle()
      }
    })
  }

  await main().catch(err => log.catchError(err))
}

export * from './type'
