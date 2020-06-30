import { Args as TArgs } from '../packages/cli/src'
import { Config as TConfig, TDLL } from '../packages/config/src'
import { MessageBus } from 'shared/message-bus'
import webpack from 'webpack'
import MFS from 'memory-fs'

declare namespace WebSteps {
  type Args = TArgs
  type Config = TConfig

  type ProcessMessage<T= string> = {
    key: T
    payload?: any
  }

  type TSSRMessageBus = {
    /**
     * 虚拟文件处理系统
     */
    'memory-fs': (payload: { mfs: MFS }) => void

    /**
     * 完整的配置文件
     */
    config: (payload: { config: TConfig }) => void

    /**
     * SSR compiler 准备就绪
     */
    'SSR-compiler': (payload: { compiler: webpack.Compiler; webpackConfig: webpack.Configuration }) => void
  }

  type SSRMessageBus = MessageBus<TSSRMessageBus>

  type TStartConfig = {
    resolve: (...args: string[]) => string
    rootDir: string
    server: any
    DLL: TDLL
    injectContext: any
    port: string | number
  }

  type TFILES_MANIFEST = Record<'base' | 'dll' | 'SSR' | 'public' | 'static', string[]>
  type DOWNLOAD_MANIFEST_FILE = TFILES_MANIFEST & { oss: any }

  type THelperInfo = {
    majorCommand: {
      name: TArgs['majorCommand']
      info: string
    }
    minorCommand: Array<{
      name: TArgs['minorCommand']
      info: string
    }>
  }
}

export = WebSteps
