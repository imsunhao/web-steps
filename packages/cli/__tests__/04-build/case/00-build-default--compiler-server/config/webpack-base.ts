import { TGetWebpackConfig } from '@web-steps/config'

const getConfig: TGetWebpackConfig = function({ resolve }) {
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
