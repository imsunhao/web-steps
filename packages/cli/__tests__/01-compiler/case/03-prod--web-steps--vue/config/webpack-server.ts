import { TGetWebpackConfig } from '@web-steps/config'

const getConfig: TGetWebpackConfig = function({ resolve }) {
  return {
    optimization: {
      minimize: false
    },
    entry: {
      server: resolve('./src/entry-server.ts')
    },
    output: {
      path: resolve('./dist')
    }
  }
}

export default getConfig
