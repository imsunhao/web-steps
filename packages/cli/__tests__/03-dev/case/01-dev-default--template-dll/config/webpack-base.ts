import { TGetWebpackConfig } from '@web-steps/config'

const getConfig: TGetWebpackConfig = function({ resolve }) {
  return {
    optimization: {
      minimize: false
    },
    output: {
      path: resolve('./dist'),
      publicPath: '/web-steps/'
    }
  }
}

export default getConfig
