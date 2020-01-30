import { TGetWebpackConfig } from '@web-steps/config'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'

const getConfig: TGetWebpackConfig = function({ resolve }) {
  return {
    optimization: {
      minimize: false
    },
    entry: {
      client: resolve('./src/entry-client.ts')
    },
    output: {
      path: resolve('./dist')
    },
    plugins: [new CleanWebpackPlugin()]
  }
}

export default getConfig
