import { Express, NextFunction, Request, Response } from 'express'
import http from 'http'
import { Args, getInitConfig } from '../utils'

export type ServerStart = SniffPromise<ReturnType<typeof getInitConfig>>
export type ServerConfig = ServerStart & { env: Args['env'] }

export type ServerLifeCycle = {
  beforeCreated?: (APP: Express) => void
  beforeStart?: (APP: Express) => void
  start?: (APP: Express) => http.Server
  beforeRender?: (req: Request, res: Response, next: NextFunction) => void
  renderContext?: (context: TServerContext, opts: { serverInfos: TServerInfos; req: Request; res: Response }) => void
  renderToString?: (context: TServerContext, fn: ((error: TRenderError, html: TRenderHTML) => void)) => void
  beforeRenderSend?: (err: TRenderError, html: TRenderHTML, next: NextFunction) => void
  renderSend?: (html: string, req: Request, res: Response, next: NextFunction) => void
  router?: (APP: Express) => void
}

export type TServerInfos = string[]
export type TServerInjectContext = any
export type TServerContext = any

export type TRenderError = any
export type TRenderHTML = string
