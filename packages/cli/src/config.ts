import { Args } from '@types'
import { config } from '@web-steps/config'
import { log } from './'
import { checkHelper } from 'shared/log'
import { COMMON_HELPER_INFO } from 'shared/setting'

const exportName = '导出静态配置文件'

const helperInfo = `
${COMMON_HELPER_INFO}
- MINOR_COMMAND_LIST
  export:          ${exportName}
`

const helperExportInfo = `
${exportName}
${COMMON_HELPER_INFO}
`

export function start(args: Args) {
  checkHelper(args, {
    majorCommand: {
      name: 'config',
      info: helperInfo
    },
    minorCommand: [
      {
        name: 'export',
        info: helperExportInfo
      }
    ]
  })
  async function main() {
    await config.init(args)
    if (args.majorCommand === 'config' && args.minorCommand === 'export') {
      config.exportStatic()
    }
  }
  main().catch(e => log.catchError(e))
}
