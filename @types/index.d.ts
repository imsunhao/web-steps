import { Args as TArgs } from '../packages/cli/src'

declare namespace WebSteps {
  type Args = TArgs

  type ProcessMessage = {
    name: string,
    payload: any
  }
}

export = WebSteps
