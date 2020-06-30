/* eslint-disable @typescript-eslint/camelcase */
import { TDescribeSetting, TTestSetting, TOnMessage } from '@web-steps/inspect'

type TGetInspectOptions = {
  name: string
  tests: TTestSetting[]
  major: string
  onMessage: TOnMessage
}

type GetInspectOptions = (opts: TGetInspectOptions) => TDescribeSetting

export const getInspectOptions: GetInspectOptions = opts => {
  const describeSetting = {
    submodule: 'submodule/tests-source',
    web_steps: {
      path: '',
      major: ''
    },
    ...opts
  }

  describeSetting.tests = describeSetting.tests.map(t => {
    t.web_steps = t.web_steps || {}
    t.web_steps.major = t.web_steps.major || describeSetting.major
    return t
  })

  return describeSetting
}
