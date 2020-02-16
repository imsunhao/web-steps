import { TAPP, log, ServerLifeCycle } from '..'
import { Service, APP, noop } from '.'

import { resolve } from 'path'
import { createBundleRenderer } from 'vue-server-renderer'
import MFS from 'memory-fs'
import { DEFAULT_TEMPLATE } from '../setting'
import { requireFromPath, processSend, cloneDeep } from 'packages/shared'
import { Config } from '@web-steps/config'

export class DevService extends Service {
  SSR = {
    clientManifest: false,
    bundle: false
  }

  fileSystem: MFS

  config: Config

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
      this.SSR.bundle = false
      this.SSR.clientManifest = false
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
    const lifeCyclePath = resolve(this.setting.cache, 'life-cycle.js')
    if (!this.fileSystem.existsSync(lifeCyclePath)) return
    const getLifeCycle: any = requireFromPath(lifeCyclePath, {
      fs: this.fileSystem
    })
    if (getLifeCycle) {
      const lifeCycle: Required<ServerLifeCycle> = getLifeCycle(this.config.startupOptions)
      if (lifeCycle) {
        this.app.hotReloadPreCheck(lifeCycle)
        Object.keys(lifeCycle).forEach((key: keyof ServerLifeCycle) => {
          this.lifeCycle[key] = lifeCycle[key] as any
        })
        this.start(this.app, { isHotReload: true })
      }
    }
  }
}

export class DevAPP extends APP {
  private _status: TAPP['status']

  readyToHotReload = false

  statusInfoMap: Partial<Record<TAPP['status'], { id: string; count: number; isClear?: boolean; pos?: number }>> = {}

  lastHotReloadStatusList: Array<TAPP['status']> = []

  priority: Array<TAPP['status']> = [
    'beforeCreated',
    'devMiddleware',
    'beforeStart',
    'start',
    'beforeRender',
    'renderContext',
    'renderToString',
    'beforeRenderSend',
    'renderSend',
    'router'
  ]

  get stack(): Array<{ id?: string }> {
    return this.express._router.stack
  }

  get status() {
    return this._status
  }

  set status(val) {
    if (typeof val === 'undefined') {
      this.readyToHotReload = true
    }

    if (this.readyToHotReload) {
      const statusInfo = this.statusInfoMap[this.status]
      if (statusInfo) {
        statusInfo.isClear = false
        statusInfo.pos = 0
      }
    }
    this._status = val
  }

  protected init() {
    log.info('[life-cycle-hot-reload] init')
    const { express: app } = this
    this.use = (...args: any) => {
      if (!this.readyToHotReload) {
        this.useInit(args)
      } else {
        this.useHotReload(args)
      }
      return app
    }
    this.render = func => {
      app.get.apply(app, ['*', func])
      return app
    }
  }

  protected useInit(args: any) {
    const { express: app } = this
    app.use.apply(app, args)
    const statusInfo = this.statusInfoMap[this.status]
    if (!statusInfo) {
      const id = this.status
      this.stack[this.stack.length - 1].id = id
      this.statusInfoMap[this.status] = {
        id,
        count: 1
      }
    } else {
      statusInfo.count++
    }
  }

  protected useHotReload(args: any) {
    const { express: app } = this
    let statusInfo = this.statusInfoMap[this.status]
    const getLayer = () => {
      app.use.apply(app, args)
      return this.stack.pop()
    }
    const initInfoStack = (id?: string) => {
      const layer = getLayer()
      layer.id = statusInfo.id
      const layerPos = this.stack.findIndex(({ id: i }) => i === (id || statusInfo.id))
      this.stack.splice(layerPos, id ? 0 : statusInfo.count, layer)
      statusInfo.pos = layerPos + 1
    }
    if (!statusInfo) {
      const index = this.priority.findIndex(p => p === this.status)
      for (let i = index; i < this.priority.length; i++) {
        const status = this.priority[i]
        if (this.statusInfoMap[status]) {
          statusInfo = this.statusInfoMap[this.status] = {
            id: this.status,
            count: 1,
            isClear: true
          }
          return initInfoStack(this.statusInfoMap[status].id)
        }
      }
      return this.useInit(args)
    }
    if (!statusInfo.isClear) {
      const layerPos = this.stack.findIndex(({ id }) => id === statusInfo.id)
      if (layerPos === -1) {
        log.error(`[life-cycle-hot-reload] not find layerID. id = ${statusInfo.id}`)
        return app
      } else {
        initInfoStack()
        statusInfo.count = 1
      }
      statusInfo.isClear = true
    } else {
      const layer = getLayer()
      this.stack.splice(statusInfo.pos++, 0, layer)
      statusInfo.count++
    }
  }

  hotReloadPreCheck(lifeCycle: Required<ServerLifeCycle>) {
    const hotReloadStatusList: Array<TAPP['status']> = Object.keys(lifeCycle) as any
    const lastHotReloadStatusList = cloneDeep(this.lastHotReloadStatusList)
    this.lastHotReloadStatusList = cloneDeep(hotReloadStatusList)
    if (!lastHotReloadStatusList.length) return

    const remove: Array<TAPP['status']> = []
    for (let i = 0; i < lastHotReloadStatusList.length; i++) {
      const lastStatus = lastHotReloadStatusList[i]
      const pos = hotReloadStatusList.findIndex(status => lastStatus === status)
      if (pos === -1) {
        remove.push(lastStatus)
        lifeCycle[lastStatus] = noop
      } else {
        hotReloadStatusList.splice(pos, 1)
      }
    }

    // const add: Array<TAPP['status']> = hotReloadStatusList
    this.removeStatus(remove)
  }

  protected removeStatus(remove: Array<TAPP['status']>) {
    if (!remove.length) return
    for (let i = 0; i < remove.length; i++) {
      const status = remove[i]
      const statusInfo = this.statusInfoMap[status]
      if (statusInfo) {
        const layerPos = this.stack.findIndex(({ id }) => id === statusInfo.id)
        if (layerPos === -1) {
          log.error(`[life-cycle-hot-reload--checkRemoveStatus] not find layerID. id = ${statusInfo.id}`)
        } else {
          this.stack.splice(layerPos, statusInfo.count)
          this.statusInfoMap[status] = undefined
        }
      }
    }
  }
}