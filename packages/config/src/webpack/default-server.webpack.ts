import VueSSRServerPlugin from 'vue-server-renderer/server-plugin'
import webpack from 'webpack'
import nodeExternals from 'webpack-node-externals'
import { TGetWebpackConfig, TRemoveCodeBlockOptions } from '@web-steps/config'
import { SSRExcludeModulePlugin } from '../plugin/ssr-exclude-module'

const VUE_ENV = 'server'

const getDefaultServerWebpackConfig: TGetWebpackConfig = function(
  startupOptions,
  {
    src: {
      SSR: {
        server: { exclude, whitelist }
      }
    }
  }
) {
  return {
    name: VUE_ENV,
    target: 'node',
    output: {
      libraryTarget: 'commonjs2'
    },
    module: {
      rules: [
        {
          test: /\.(ts|js|vue)$/,
          enforce: 'pre',
          exclude: /node_modules/,
          use: [
            {
              loader: '@web-steps/config/dist/remove-code-block.js',
              options: {
                VUE_ENV
              } as TRemoveCodeBlockOptions
            }
          ]
        },
        {
          test: /\.scss$/,
          use: 'null-loader'
        },
        {
          test: /\.css$/,
          use: 'null-loader'
        }
      ]
    },
    externals: [
      nodeExternals({
        whitelist: [/\.css$/, /\?vue&type=style/, ...whitelist]
      })
    ],
    performance: {
      maxEntrypointSize: 1024 * 1024 * 6,
      maxAssetSize: 1024 * 1024 * 3,
      hints: false
    },
    plugins: [
      new VueSSRServerPlugin(),
      new webpack.DefinePlugin({
        'process.env.VUE_ENV': `"${VUE_ENV}"`
      }),
      new SSRExcludeModulePlugin({
        VUE_ENV,
        list: exclude,
        debug: !!__DEBUG_PORT__
      })
    ]
  }
}

export default getDefaultServerWebpackConfig
