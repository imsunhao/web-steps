import express, { Express } from 'express'
import { createBundleRenderer } from 'vue-server-renderer'
import { ServerLifeCycle, TServerContext, TServerInjectContext, TServerInfos, log } from '../'
import { DEFAULT_PORT } from '../setting'
import { randomStringAsBase64Url } from './random'
import http from 'http'
import { TRender } from '@web-steps/config'
import { requireFromPath, processSend } from 'packages/shared'

export function initServer(lifeCycle: ServerLifeCycle, render: TRender) {
  const requiredLifeCycle = getRequiredLifeCycle(lifeCycle, render)
  const {
    beforeCreated,
    beforeStart,
    start,
    beforeRender,
    renderContext,
    renderToString,
    beforeRenderSend,
    renderSend,
    router
  } = requiredLifeCycle

  const APP = express()

  beforeCreated(APP)
  serverCreating(APP)

  beforeStart(APP)
  start(APP)

  APP.get('*', (req, res, next) => {
    beforeRender(req, res, next)
    const context = getRenderContext(req, res)
    const serverInfos: TServerInfos = [
      `express/${require('express/package.json').version}`,
      `vue/${require('vue/package.json').version}`,
      `web-steps/${__VERSION__}`
    ]
    renderContext(context, { serverInfos, req, res })
    res.setHeader('Content-Type', 'text/html')
    res.setHeader('Server', serverInfos)

    renderToString(context, (err, html) => {
      beforeRenderSend(err, html, next)
      renderSend(html, req, res, next)
      next()
    })
  })

  router(APP)

  return APP
}

function serverCreating(APP: Express) {}

const serverStart: Required<ServerLifeCycle>['start'] = function(APP) {
  let port = DEFAULT_PORT
  const WAIT_TIME = 1000
  const MAX = 60
  let index = 0
  const SERVER = http.createServer(APP)
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
    if (__TEST__ && __WEB_STEPS__) {
      processSend(process, { messageKey: 'e2e' })
    }
  })

  start()

  return SERVER
}
const serverRenderSend: Required<ServerLifeCycle>['renderSend'] = function(html, req, res) {
  res.end(html)
}
const createBundleRendererRenderToString: (render: TRender) => Required<ServerLifeCycle>['renderToString'] = function({
  bundlePath,
  templatePath,
  clientManifestPath
}) {
  const renderer = createBundleRenderer(bundlePath, {
    template: templatePath ? requireFromPath(templatePath) : undefined,
    clientManifest: requireFromPath(clientManifestPath)
  })
  return renderer.renderToString
}
const noop: any = function() {}

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
    head: 'TODO'
  }

  if (!injectContext.CSP_DISABLED) {
    const nonce = randomStringAsBase64Url(12)
    context.nonce = nonce
  }
  return context
}

function getRequiredLifeCycle(
  {
    beforeCreated,
    beforeStart,
    start,
    beforeRender,
    renderContext,
    renderToString,
    beforeRenderSend,
    renderSend,
    router
  }: ServerLifeCycle,
  render: TRender
): Required<ServerLifeCycle> {
  return {
    beforeCreated: beforeCreated || noop,
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
