import { TGetWebpackConfig } from '@web-steps/config'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'

const getConfig: TGetWebpackConfig = function({ resolve }) {
  return {
    entry: {
      client: resolve('./src/entry-client.ts')
    },
    module: {
      rules: [
        {
          test: /\.(ts|js|vue)$/,
          enforce: 'pre',
          exclude: /node_modules/,
          use: [
            {
              loader: '@web-steps/helper/dist/remove-code-block.js',
              options: {
                VUE_ENV: 'client'
              }
            }
          ]
        }
      ]
    },
    externals: { vue: 'Vue', 'vue-router': 'VueRouter', vuex: 'Vuex' },
    plugins: [new CleanWebpackPlugin()]
  }
}

export default getConfig
