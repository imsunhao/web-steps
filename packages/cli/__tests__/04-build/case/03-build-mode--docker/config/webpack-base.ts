import { TGetWebpackConfig } from '@web-steps/config'

const getConfig: TGetWebpackConfig = function() {
  return {
    optimization: {
      minimize: false
    },
    output: {
      publicPath: '/web-steps/'
    }
  }
}

export default getConfig
