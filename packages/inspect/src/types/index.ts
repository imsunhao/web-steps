import { ProcessMessage } from '@types'
import execa from 'execa'

/**
 * 测试 test 配置
 */
export type TTestSetting<T = any> = {
  /**
   * 测试名称
   */
  name: string

  /**
   * 测试仓库 hash 值
   */
  hash: string

  /**
   * 测试的项目地址
   * - 不需要配置 自动注入
   */
  rootDir?: string

  /**
   * 测试的项目地址
   * - 不需要配置 自动注入
   * - 37000 开始自加
   */
  port?: number

  /**
   * nodejs 环境变量
   */
  envs?: Record<string, string>

  /**
   * 是否启用调试
   */
  debug?: boolean

  /**
   * 是否跳过测试
   */
  skip?: boolean

  /**
   * web_steps 配置
   */
  web_steps?: TTestWebSteps

  /**
   * 期望值
   */
  expect?: T

  /**
   * web-steps进程的钩子函数
   */
  onMessage?: TOnMessage
}

/**
 * 测试 describe 配置
 */
export type TDescribeSetting = {
  name: string
  /**
   * 测试 子仓库 地址
   */
  submodule: string
  web_steps: Required<TTestWebSteps>
  tests: TTestSetting[]
  major: string
  onMessage: TOnMessage
}

export type TTestSettingInject = {
  /**
   * 测试自动创建的目录地址
   */
  rootDir: string
}

export type TTestWebSteps = {
  /**
   * web-steps 目标
   */
  target?: 'SSR' | 'custom'

  /**
   * 测试超时时间
   * - 默认 15000ms
   */
  timeout?: number

  /**
   * major-command
   */
  major?: string

  /**
   * 启用缓存
   */
  cache?: boolean

  /**
   * 生产环境 or 开发环境
   */
  env?: 'production' | 'development'

  /**
   * nodejs 命令参数
   */
  argv?: string[]
}

export type TOnMessage<T = TTestSetting> = (
  opts: { message: ProcessMessage; test: T; done: () => void; childProcess: execa.ExecaChildProcess<string> }
) => void
