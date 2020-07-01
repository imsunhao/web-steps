import { TDescribeSetting, TTestSetting, TOnMessage } from '@web-steps/inspect'
import { merge } from 'shared/lodash'

type TGetInspectOptions = {
  name: string
  tests: TTestSetting[]
  major: string
  onMessage: TOnMessage
}

type GetInspectOptions = (opts: TGetInspectOptions) => TDescribeSetting

export const getInspectOptions: GetInspectOptions = opts => {
  function getDefaultWebSteps(): TDescribeSetting['web_steps'] {
    return {
      major: '',
      target: 'SSR',
      timeout: 15000,
      cache: false,
      env: 'production',
      argv: [] as any
    }
  }

  const describeSetting: TDescribeSetting = {
    submodule: 'submodule/tests-source',
    web_steps: getDefaultWebSteps(),
    ...opts
  }

  describeSetting.tests = describeSetting.tests.map(t => {
    t.web_steps = t.web_steps || {}
    t.web_steps = merge(getDefaultWebSteps(), t.web_steps)
    t.web_steps.major = t.web_steps.major || describeSetting.major
    return t
  })

  return describeSetting
}
