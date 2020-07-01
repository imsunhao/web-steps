import { TTestSetting, TOnMessage } from '@web-steps/inspect'
import { ClickOptions, Page } from 'puppeteer-core'

type TOutput = {
  name: string
  filePath: string
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

export type TestSetting = TTestSetting<TExpect>
export type OnMessage<T = TestSetting> = TOnMessage<T>
