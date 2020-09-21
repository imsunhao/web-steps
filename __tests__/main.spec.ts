import minimist from 'minimist'
import { makeWebStepsTests } from '@web-steps/inspect'
import { getInspectOptions } from './helpers/getInspectOptions'
import { RunOptions } from 'shared/node'

import { config } from './settings/configs'

const args = minimist(process.argv.slice(3), { string: 'case', boolean: ['read', 'show'] })

const runOptions: RunOptions = {
  isRead: args.read,
  isSilence: !args.show
}

makeWebStepsTests(getInspectOptions(config), runOptions, args)
