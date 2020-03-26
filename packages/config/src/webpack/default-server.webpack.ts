import VueSSRServerPlugin from 'vue-server-renderer/server-plugin'
import webpack from 'webpack'
import nodeExternals from 'webpack-node-externals'
import { TGetWebpackConfig, TRemoveCodeBlockOptions } from '@web-steps/config'
import { SSRExcludeModulePlugin } from '../plugin/ssr-exclude-module'

const VUE_ENV = 'server'

const getDefaultServerWebpackConfig: TGetWebpackConfig = function(
  { args: { env } },
  {
    src: {
      SSR: {
        server: { exclude, whitelist }
      }
    }
  }
) {
  const isProd = env === 'production'
  const threadLoader = {
    loader: 'thread-loader',
    options: {
      poolTimeout: isProd ? 500 : Infinity
    }
  }
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
        },
        {
          test: /\.js$/,
          use: ['cache-loader', threadLoader],
          exclude: /node_modules/
        },
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: [
            'cache-loader',
            threadLoader,
            {
              loader: 'ts-loader',
              options: {
                appendTsSuffixTo: [/\.vue$/],
                transpileOnly: true,
                happyPackMode: true
              }
            }
          ]
        }
      ]
    },
    externals: [
      nodeExternals({
        whitelist
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
