import { Args as TArgs } from '../packages/cli/src'
import { Config as TConfig } from '../packages/config/src'

declare namespace WebSteps {
  type Args = TArgs
  type Config = TConfig

  type ProcessMessage = {
    messageKey: string
    payload?: any
  }
}

export = WebSteps
