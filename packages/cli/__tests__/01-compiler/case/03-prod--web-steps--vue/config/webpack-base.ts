import { TGetWebpackConfig } from '@web-steps/config'

const getConfig: TGetWebpackConfig = function({ resolve }) {
  return {
    optimization: {
      minimize: false
    },
    output: {
      path: resolve('./dist')
    },
    externals: ['vue', 'vue-router']
  }
}

export default getConfig
