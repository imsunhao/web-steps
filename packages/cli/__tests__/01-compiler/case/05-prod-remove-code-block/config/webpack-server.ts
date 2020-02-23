import { TGetWebpackConfig } from '@web-steps/config'

const getConfig: TGetWebpackConfig = function({ resolve }) {
  return {
    entry: {
      server: resolve('./src/entry-server.ts')
    }
  }
}

export default getConfig
