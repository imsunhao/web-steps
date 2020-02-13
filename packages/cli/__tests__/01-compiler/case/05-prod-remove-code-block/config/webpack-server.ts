import { TGetWebpackConfig } from '@web-steps/config'

const getConfig: TGetWebpackConfig = function({ resolve }) {
  return {
    entry: {
      server: resolve('./src/entry-server.ts')
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
                VUE_ENV: 'server'
              }
            }
          ]
        }
      ]
    }
  }
}

export default getConfig
