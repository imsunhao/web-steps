import { TTestSetting, TOnMessage } from '@web-steps/inspect'
import { ClickOptions, Page } from 'puppeteer-core'

type TOutput = {
  name: string
  filePath: string
}

type TInspectSetting = {
  /**
   * 超时时间
   * - 默认 15000ms
   */
  timeout?: number
  vscodeDebug?: boolean
  skip?: boolean
  todo?: boolean
  /**
   * 是否启用缓存
   * - 默认启用
   */
  cache?: boolean
  node: {
    target: 'web-steps' | 'web-steps--compiler'
    rootDir: string
    env?: 'production' | 'development'
    envs?: Record<string, string>
    argv?: string[]
  }
  webSteps?: {
    target: 'SSR' | 'SSR-client' | 'SSR-server' | 'custom'
  }
  close?: boolean
}

type TExpect = {
  docker?: {
    path: string
    content: string
  }
  build?: {
    filesManifest?: {
      path: string
      content: any
    }
  }
  config?: any
  EXPORT_CONFIG?: {
    path: string
    result: any
  }
  output?: TOutput[]
  debug?: string[]
  cache?: Record<string, string>
  e2e?: {
    debug?: boolean
    url: string
    texts?: Record<string, string>
    action?: (
      opts: {
        text: any
        click: (selector: string, options?: ClickOptions) => Promise<void>
        page: Page
        show: boolean
      }
    ) => Promise<any>
  }
}

export type TestSetting = TTestSetting<TInspectSetting, TExpect>
export type OnMessage<T = TExpect> = TOnMessage<T>
