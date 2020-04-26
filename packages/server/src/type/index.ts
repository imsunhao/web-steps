import { Express, NextFunction, Request, Response } from 'express'
import { Args, getInitConfig } from '../utils'
import { createBundleRenderer } from 'vue-server-renderer'
import http, { IncomingHttpHeaders } from 'http'

export type ServerStart = SniffPromise<ReturnType<typeof getInitConfig>>
export type ServerConfig = ServerStart & { env: Args['env'] }

export type TAPP = {
  status?: keyof ServerLifeCycle
  /**
   * 热重载 use
   * - 只有 使用这个 use 才会被 热重载
   */
  use: Express['use']
  render: (func: (req: Request, res: Response, next: NextFunction) => void) => void
  express: Express
  hotReloadPreCheck?: (lifeCycle: Required<ServerLifeCycle>) => void
}

export type ServerLifeCycle = {
  beforeCreated?: (APP: TAPP) => void
  creating?: (APP: TAPP, server: ServerConfig['server'], setting: ServerConfig['setting']) => void
  devMiddleware?: (APP: TAPP) => void
  beforeStart?: (APP: TAPP) => void
  start?: (APP: TAPP) => http.Server[]
  getDefaultRenderContext?: (req: Request, res: Response) => any
  beforeRender?: (req: Request, res: Response, next: NextFunction) => void
  renderContext?: (context: TServerContext, opts: { serverInfos: TServerInfos; req: Request; res: Response }) => void
  renderToString?: ReturnType<typeof createBundleRenderer>['renderToString']
  beforeRenderSend?: (err: TRenderError, html: TRenderHTML, next: NextFunction) => void
  renderSend?: (html: string, req: Request, res: Response, next: NextFunction) => void
  router?: (APP: TAPP) => void
}

export type TServerInfos = string[]
export type TServerInjectContext = Partial<{
  CSP_DISABLED: boolean
  SERVER_HOST: string
}>

export type TServerContext<INJECT_CONTEXT = TServerInjectContext, LOCALS = TServerContextLocals> = {
  pageInfo: {
    title: string,
    keywords: string,
    description: string
  }
  injectContext: INJECT_CONTEXT
  url: string
  locals: LOCALS
  nonce?: string
  head: string
  headers: IncomingHttpHeaders
}

export type TRenderError = any
export type TRenderHTML = string
export type TServerContextLocals = any
