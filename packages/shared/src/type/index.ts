import { Config } from '@web-steps/config'
import { Args } from '@web-steps/cli'

export type ProcessMessageMap = {
  config: Config['config']
  setting: Config['setting']
  args: Args
}
