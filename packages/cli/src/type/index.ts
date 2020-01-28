import execa from 'execa'

export type MinorCommandKey = 'dev' | 'build' | 'release' | 'deploy' | 'debug' | 'start' | 'config' | 'create'

export type RunOptions = execa.Options<string> & {
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
