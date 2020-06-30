import { ProcessMessage } from '@types'

/**
 * 测试 test 配置
 */
export type TTestSetting<S = any, T = any> = {
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
   * - 不需要配置
   */
  rootDir?: string

  /**
   * web_steps 基础配置
   */
  web_steps?: TTestWebSteps

  /**
   * 测试环境变量设置
   */
  setting: (inject: TTestSettingInject) => S

  /**
   * 期望值
   */
  expect: T

  /**
   * web-steps进程的钩子函数
   */
  onMessage?: TOnMessage<T>
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
   * major-command
   */
  major?: string

  /**
   * web_steps 路径
   */
  path?: string
}

export type TOnMessage<T = any> = (message: ProcessMessage, expect: T, done: () => void) => void
