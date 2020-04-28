import { TLogArg } from '../type'
import { Args, THelperInfo } from '@types'
import { DEFAULT_HELPER_INFO } from 'shared/setting'

export class Log {
  private args: TLogArg

  private packageName: string
  packagePrefix: string

  constructor(packageName: string, args: TLogArg) {
    this.packageName = packageName
    this.packagePrefix = `[@web-steps/${this.packageName}]`
    this.args = args

    if (packageName !== 'cli') {
      this.debug(`\n\n${this.packagePrefix} start!\n\n`)
    }
  }

  info(...args: any[]) {
    console.log.apply(undefined, args)
  }

  log(...args: any[]) {
    console.log.apply(undefined, args)
  }

  debug(...args: any[]) {
    console.debug.apply(undefined, [...args])
  }

  success(...args: any[]) {
    console.log.apply(undefined, [this.packagePrefix, ...args])
  }

  fatal(...args: any[]) {
    console.error.apply(undefined, [this.packagePrefix, ...args])
  }

  warn(...args: any[]) {
    console.log.apply(undefined, [this.packagePrefix, 'warning', ...args])
  }

  error(...args: any[]) {
    console.error.apply(undefined, args)
    throw new Error(`${this.packagePrefix} ${args.join(' ')}`)
  }

  catchError(...errors: any) {
    console.error.apply(undefined, errors)
    this.debug(`\n\n${this.packagePrefix} catchError!\n\n`)
    if (this.args.env === 'production') {
      process.exit(1)
    }
  }
}

export function checkHelper(args: Args, helperInfo?: THelperInfo) {
  if (!args.helper) return
  let info = ''
  if (!args.majorCommand) {
    args.majorCommand = 'cli'
    info = DEFAULT_HELPER_INFO
  } else if (!helperInfo) {
  } else if (args.minorCommand && helperInfo.majorCommand.name === args.majorCommand) {
    const minorCommandInfo = helperInfo.minorCommand.find(({ name }) => name === args.minorCommand)
    if (!minorCommandInfo) {
      info = `\t未能找到 ${args.majorCommand} 下的 ${args.minorCommand} 命令\n${helperInfo.majorCommand.info}`
    } else {
      info = minorCommandInfo.info
    }
  } else if (helperInfo.majorCommand.name === args.majorCommand) {
    info = helperInfo.majorCommand.info
  }
  if (info) {
    console.log(`\n[@web-steps/helper] ${args.majorCommand} ${args.minorCommand || ''}\n${info}`)
    process.exit(0)
  }
}
