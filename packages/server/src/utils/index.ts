import express from 'express'
import { createBundleRenderer } from 'vue-server-renderer'
import { ServerLifeCycle, TServerContext, TServerInjectContext, TServerInfos, log, TAPP } from '../'
import { DEFAULT_PORT, DEFAULT_TEMPLATE } from '../setting'
import { randomStringAsBase64Url } from './random'
import http from 'http'
import { basename } from 'path'
import { TServer, TRender, TSetting } from '@web-steps/config'
import { requireFromPath, processSend } from 'packages/shared'

type RequiredServerLifeCycle = Required<ServerLifeCycle>

export class APP implements TAPP {
  express: TAPP['express']
  use: TAPP['use']
  render: TAPP['render']

  constructor() {
    this.express = express()
    this.init()
  }

  protected init() {
    const { express: e } = this
    this.use = e.use.bind(e)
    this.render = e.get.bind(e)
  }
}

export class Service {
  lifeCycle: RequiredServerLifeCycle
  server: TServer<'finish'>
  setting: TSetting
  app: TAPP
  SERVER: http.Server

  compilersWatching: any[] = []

  constructor(server: TServer<'finish'>, setting: TSetting, app: TAPP) {
    this.lifeCycle = getRequiredLifeCycle(server)
    this.server = server
    this.setting = setting
    this.app = app
  }

  start(app = this.app, { isHotReload } = { isHotReload: false }) {
    app.status = 'beforeCreated'
    this.lifeCycle.beforeCreated(app)

    if (!isHotReload) {
      app.status = 'creating'
      this.lifeCycle.creating(app, this.server, this.setting)
      app.status = 'devMiddleware'
      this.lifeCycle.devMiddleware(app)
    }

    app.status = 'beforeStart'
    this.lifeCycle.beforeStart(app)

    if (!isHotReload) {
      app.status = 'start'
      this.SERVER = this.lifeCycle.start(app)

      app.render((req, res, next) => {
        let isNext = false
        const n = () => {
          isNext = true
          next()
        }
        this.lifeCycle.beforeRender(req, res, n)
        if (isNext) return

        const context = getRenderContext(req, res)
        const serverInfos: TServerInfos = [
          `express/${require('express/package.json').version}`,
          `vue/${require('vue/package.json').version}`,
          `web-steps/${__VERSION__}`
        ]

        this.lifeCycle.renderContext(context, { serverInfos, req, res })

        res.setHeader('Content-Type', 'text/html')
        res.setHeader('Server', serverInfos)

        this.lifeCycle.renderToString(context, (err, html) => {
          this.lifeCycle.beforeRenderSend(err, html, n)
          if (isNext) return
          this.lifeCycle.renderSend(html, req, res, n)
        })
      })
    }

    app.status = 'router'
    this.lifeCycle.router(app)

    app.status = undefined
  }

  close() {
    this.compilersWatching.map(watching => watching.close())
    if (this.SERVER) this.SERVER.close()
  }
}

function serverCreating(APP: TAPP, { statics, proxyTable, env }: TServer<'finish'>, { output }: TSetting) {
  const serverStatics = () => {
    if (statics === false) return
    else if (!statics) {
      statics = {
        ['/' + basename(output)]: {
          path: output
        }
      }
    }

    Object.keys(statics).forEach(eStaticKey => {
      const eStatic = (statics as any)[eStaticKey]
      log.info('[statics]', eStaticKey, eStatic.path, eStatic.maxAge)
      APP.use(
        eStaticKey,
        express.static(eStatic.path, {
          maxAge: eStatic.maxAge || 0
        })
      )
    })
  }
  serverStatics()
}

const serverStart: RequiredServerLifeCycle['start'] = function(APP) {
  let port = DEFAULT_PORT
  const WAIT_TIME = 1000
  const MAX = 60
  let index = 0
  const SERVER = http.createServer(APP.express)
  const start = () => {
    SERVER.listen(port)
  }

  SERVER.on('error', function(error) {
    if (index++ < MAX) {
      log.fatal('SERVER_START:', error.message, `\n\t重试中, 当前次数: ${index}`)
      setTimeout(() => {
        start()
      }, WAIT_TIME)
    } else {
      process.exit(1)
    }
  })

  SERVER.on('listening', function() {
    log.info(`server started at ${port}`)
  })

  start()

  return SERVER
}

const serverRenderSend: RequiredServerLifeCycle['renderSend'] = function(html, req, res, next) {
  res.send(html)
}

const createBundleRendererRenderToString: (render: TRender) => RequiredServerLifeCycle['renderToString'] = function({
  bundlePath,
  templatePath,
  clientManifestPath
}) {
  try {
    const renderer = createBundleRenderer(bundlePath, {
      inject: true,
      template: templatePath ? requireFromPath(templatePath) : DEFAULT_TEMPLATE,
      clientManifest: requireFromPath(clientManifestPath)
    })
    if (__TEST__ && __WEB_STEPS__) {
      processSend(process, { messageKey: 'e2e' })
    }
    return renderer.renderToString
  } catch (error) {
    const renderToString: any = (context: any, fn: any) => {
      fn(undefined, '<h1>等待webpack中...</h1>')
      return
    }
    return renderToString
  }
}

export const noop: any = function() {}

function getRenderContext(req: { url: any }, res: { locals: any }) {
  const injectContext: TServerInjectContext = {}
  const context: TServerContext = {
    injectContext,
    pageInfo: {
      title: '',
      keywords: '',
      description: ''
    },
    url: req.url,
    locals: res.locals,
    nonce: '',
    head: ''
  }

  if (!injectContext.CSP_DISABLED) {
    const nonce = randomStringAsBase64Url(12)
    context.nonce = nonce
  }
  return context
}

function getRequiredLifeCycle({
  lifeCycle: {
    beforeCreated,
    creating,
    beforeStart,
    start,
    beforeRender,
    renderContext,
    renderToString,
    beforeRenderSend,
    renderSend,
    router
  },
  render
}: TServer<'finish'>): RequiredServerLifeCycle {
  return {
    beforeCreated: beforeCreated || noop,
    creating: creating || serverCreating,
    devMiddleware: noop,
    beforeStart: beforeStart || noop,
    start: start || serverStart,
    beforeRender: beforeRender || noop,
    renderContext: renderContext || noop,
    renderToString: renderToString || createBundleRendererRenderToString(render),
    beforeRenderSend: beforeRenderSend || noop,
    renderSend: renderSend || serverRenderSend,
    router: router || noop
  }
}

export * from './config'
export * from './random'
