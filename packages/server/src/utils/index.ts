import express from 'express'
import { createBundleRenderer } from 'vue-server-renderer'
import { ServerLifeCycle, TServerContext, TServerInjectContext, TServerInfos, log, TAPP } from '../'
import { randomStringAsBase64Url } from './random'
import http, { IncomingHttpHeaders } from 'http'
import { basename } from 'path'
import { TServer, TRender, TSetting, TDLL } from '@web-steps/config'
import { DEFAULT_PORT, DEFAULT_INJECT_CONTEXT, DEFAULT_TEMPLATE } from 'shared/setting'
import { processSend } from 'shared/node'
import { requireFromPath } from 'shared/require'
import serialize from 'serialize-javascript'
import proxyMiddleware from 'http-proxy-middleware'

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
    this.render = (...args: any) => {
      e.get.apply(e, ['*', ...args])
    }
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
  const serverProxyTable = () => {
    if (proxyTable === false || !proxyTable) return

    const table = proxyTable(process.__INJECT_CONTEXT__)

    Object.keys(table).forEach(function(proxyKey) {
      let options = table[proxyKey]
      if (typeof options === 'string') {
        options = { target: options }
      }
      // eslint-disable-next-line @typescript-eslint/unbound-method
      options.onError = options.onError || ((err: any) => log.warn(err))
      APP.use(proxyMiddleware(proxyKey, options))
    })
  }

  serverStatics()
  serverProxyTable()
}

function serverBeforeRenderSend(err: any, html: string, next: express.NextFunction) {
  if (err) {
    log.error(err)
    return next()
  }
}

const serverStart: RequiredServerLifeCycle['start'] = function(APP) {
  const port = process.env.PORT || DEFAULT_PORT
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
    log.info(`\n\nserver listening at ${port}\n\n`)
  })

  start()

  return [SERVER]
}

const serverRenderSend: RequiredServerLifeCycle['renderSend'] = function(html, req, res, next) {
  res.send(html)
}

const createBundleRendererRenderToString: (
  render: TRender,
  DLL: TDLL
) => RequiredServerLifeCycle['renderToString'] = function({ bundlePath, templatePath, clientManifestPath }, DLL) {
  try {
    const renderer = createBundleRenderer(bundlePath, {
      inject: true,
      template: templatePath ? requireFromPath(templatePath) : DEFAULT_TEMPLATE,
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      clientManifest: Service.getClientManifestAfterAddDll(requireFromPath(clientManifestPath), DLL)
    })
    if (__TEST__ && __WEB_STEPS__) {
      processSend(process, { key: 'e2e' })
    }
    // eslint-disable-next-line @typescript-eslint/unbound-method
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

function getRenderContext(req: { url: string; headers: IncomingHttpHeaders }, res: { locals: any }) {
  const injectContext: TServerInjectContext = process.__INJECT_CONTEXT__
  const context: TServerContext = {
    injectContext,
    pageInfo: {
      title: '',
      keywords: '',
      description: ''
    },
    headers: req.headers,
    url: req.url,
    locals: res.locals,
    nonce: '',
    head: ''
  }
  const INJECT_ENV = { nonce: context.nonce }
  process.__INJECT_ENV__.forEach((key: keyof typeof INJECT_ENV) => {
    INJECT_ENV[key] = process.env[key]
  })

  if (!injectContext.CSP_DISABLED) {
    const nonce = randomStringAsBase64Url(12)
    context.nonce = nonce
  }

  const autoRemove = __PRODUCTION__
    ? ';(function(){var s;(s=document.currentScript||document.scripts[document.scripts.length-1]).parentNode.removeChild(s);}());'
    : ''

  const nonceStr = context.nonce ? `nonce="${context.nonce}"` : ''
  context.head = `<script ${nonceStr}>window.__INJECT_ENV__ = ${serialize(INJECT_ENV, {
    isJSON: true
  })};window.__INJECT_CONTEXT__ = ${serialize(injectContext, { isJSON: true })}${autoRemove}</script>`
  return context
}

function getRequiredLifeCycle(
  {
    lifeCycle: {
      beforeCreated,
      creating,
      beforeStart,
      start,
      beforeRender,
      getDefaultRenderContext,
      renderContext,
      renderToString,
      beforeRenderSend,
      renderSend,
      router
    },
    render
  }: TServer<'finish'>,
  DLL: TDLL
): RequiredServerLifeCycle {
  return {
    beforeCreated: beforeCreated || noop,
    creating: creating || serverCreating,
    devMiddleware: noop,
    beforeStart: beforeStart || noop,
    start: start || serverStart,
    beforeRender: beforeRender || noop,
    getDefaultRenderContext: getDefaultRenderContext || getRenderContext,
    renderContext: renderContext || noop,
    renderToString: renderToString || createBundleRendererRenderToString(render, DLL),
    beforeRenderSend: beforeRenderSend || serverBeforeRenderSend,
    renderSend: renderSend || serverRenderSend,
    router: router || noop
  }
}

export class Service {
  lifeCycle: RequiredServerLifeCycle
  server: TServer<'finish'>
  setting: TSetting
  app: TAPP
  SERVER: http.Server[]
  DLL: TDLL

  compilersWatching: any[] = []

  constructor(server: TServer<'finish'>, setting: TSetting, app: TAPP, DLL: TDLL) {
    this.DLL = DLL
    this.lifeCycle = getRequiredLifeCycle(server, DLL)
    this.server = server
    this.setting = setting
    this.app = app
  }

  start(app = this.app, { isHotReload } = { isHotReload: false }) {
    app.status = 'beforeCreated'
    this.lifeCycle.beforeCreated(app)

    app.status = 'creating'
    this.lifeCycle.creating(app, this.server, this.setting)

    if (!isHotReload) {
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

        const context = this.lifeCycle.getDefaultRenderContext(req, res)
        const serverInfos: TServerInfos = [
          `express/${require('express/package.json').version}`,
          `vue/${require('vue/package.json').version}`,
          `web-steps/${__VERSION__}`
        ]

        this.lifeCycle.renderContext(context, { serverInfos, req, res })

        res.setHeader('Content-Type', 'text/html')
        res.setHeader('Server', serverInfos)

        try {
          this.lifeCycle.renderToString(context, (err, html) => {
            this.lifeCycle.beforeRenderSend(err, html, n)
            if (isNext) return
            this.lifeCycle.renderSend(html, req, res, n)
          })
        } catch (error) {
          log.error(error)
        }
      })
    }

    app.status = 'router'
    this.lifeCycle.router(app)

    app.status = undefined
  }

  close() {
    this.compilersWatching.map(watching => watching.close())
    if (this.SERVER) {
      this.SERVER.forEach(server => {
        server.close()
      })
    }
  }

  static updateInjectContext(injectContext: any) {
    log.info(`updated [INJECT_CONTEXT] time: ${new Date().toLocaleString()}`)
    process.__INJECT_CONTEXT__ = injectContext || DEFAULT_INJECT_CONTEXT
  }

  static updateInjectENV(INJECT_ENV: any) {
    process.__INJECT_ENV__ = INJECT_ENV || []
    log.info(`updated [INJECT_ENV] time: ${new Date().toLocaleString()}`, process.__INJECT_ENV__)
  }

  static getClientManifestAfterAddDll(clientManifest: any, DLL: TDLL) {
    if (DLL) {
      const dll: string[] = DLL as any
      try {
        dll.forEach((js: string) => {
          clientManifest.all.push(js)
        })
        dll.reverse().forEach((js: string) => {
          clientManifest.initial.unshift(js)
        })
      } catch (error) {
        log.error('[getClientManifestAfterAddDll]', error)
      }
    }
    return clientManifest
  }
}

export * from './config'
export * from './random'
