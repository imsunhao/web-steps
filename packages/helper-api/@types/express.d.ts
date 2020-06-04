import { RequestHandler } from 'express'

export type POST<Req, Res> = RequestHandler<any, Res, Req, any>
