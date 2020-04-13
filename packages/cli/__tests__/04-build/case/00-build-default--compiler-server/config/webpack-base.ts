import { TGetWebpackConfig } from '@web-steps/config'

const getConfig: TGetWebpackConfig = function({ resolve }) {
  return {
    resolve: {
      alias: {
        '@test': resolve('@test')
      }
    },
    optimization: {
      minimize: false
    },
    output: {
      publicPath: '/web-steps/'
    }
  }
}

export default getConfig
