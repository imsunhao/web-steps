import execa from 'execa'

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
  | 'compiler'
export type MinorCommandKey = 'upload' | 'download'

export type RunOptions = execa.Options<string> & CustomRunOptions

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
}
