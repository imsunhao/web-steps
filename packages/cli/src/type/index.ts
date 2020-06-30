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
