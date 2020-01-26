// const isDebug = !!process.env.DEBUG_PORT
const consolePrefix = '[@web-steps/config] '

export class Config {
  private isInit = false
  path = ''

  async getConfig() {
    if (!this.isInit) throw new Error(consolePrefix + 'Config need init first. try await config.init()')
  }

  async init(args: any) {
    args.rootDir
    const main = async () => {
      this.path = '/Users/sunhao/Documents/imsunhao/utils/__tests__/config.js'
      this.isInit = true
    }

    return await main().catch((err: any) => {
      console.error(err)
    })
  }

  async exportStatic() {
    const main = async () => {
      this.path = ''
    }
    return await main().catch((err: any) => {
      console.error(err)
    })
  }
}

export const config = new Config()
