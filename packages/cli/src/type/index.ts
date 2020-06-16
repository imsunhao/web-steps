import { Options } from 'execa'

export type MajorCommandKey =
  | 'dev'
  | 'build'
  | 'release'
  | 'deploy'
  | 'debug'
  | 'start'
  | 'config'
  | 'create'
  | 'test'
  | 'pre'
  | 'compiler'
  | 'download'
  | 'cli'

export type MinorCommandKey = 'export'

export type RunOptions = Options<string> & CustomRunOptions

export type CustomRunOptions = {
  /**
   * 是否启用 只读模式
   * - 不会真正运行
   */
  isRead?: boolean

  /**
   * 是否启用 沉默运行
   */
  isSilence?: boolean

  /**
   * 环境变量
   */
  envs?: Record<string, string>
}
