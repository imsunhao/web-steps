import { Config } from '@web-steps/config'
import { Args } from '../index'

export type MinorCommandKey = 'dev' | 'build' | 'release' | 'deploy' | 'debug' | 'start' | 'config' | 'create'

export type MinorCommandSetting = {
  send: boolean
}

export type MinorCommandSettingList<T extends string> = { [key in T]: MinorCommandSetting }

export type MessageMap = {
  config: Config['config']
  setting: Config['setting']
  args: Args
}
