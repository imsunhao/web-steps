export type MinorCommandKey = 'dev' | 'build' | 'release' | 'deploy' | 'debug' | 'start' | 'config' | 'create'

export type MinorCommandSetting = {
  send: boolean
}

export type MinorCommandSettingList<T extends string> = { [key in T]: MinorCommandSetting }