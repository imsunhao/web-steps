import { TGetWebpackConfig } from '@web-steps/config'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'

const getConfig: TGetWebpackConfig = function({ resolve }) {
  return {
    entry: {
      client: resolve('./src/entry-client.ts')
    },
    externals: { vue: 'Vue', 'vue-router': 'VueRouter', vuex: 'Vuex' },
    plugins: [new CleanWebpackPlugin()]
  }
}

export default getConfig
