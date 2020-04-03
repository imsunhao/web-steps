import VueSSRClientPlugin from 'vue-server-renderer/client-plugin'
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin'
import { SSRExcludeModulePlugin } from '../plugin/ssr-exclude-module'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import webpack from 'webpack'
import { TGetWebpackConfig, TRemoveCodeBlockOptions } from '@web-steps/config'

const VUE_ENV = 'client'

const getDefaultClientWebpackConfig: TGetWebpackConfig = function(
  { args: { env } },
  {
    src: {
      SSR: {
        client: { exclude }
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
          use: [
            isProd ? MiniCssExtractPlugin.loader : 'vue-style-loader',
            'css-loader',
            {
              loader: 'sass-loader',
              options: {
                sourceMap: false
              }
            }
          ]
        },
        {
          test: /\.css$/,
          use: [isProd ? MiniCssExtractPlugin.loader : 'vue-style-loader', 'css-loader']
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
        },
        {
          test: /\.(png|jpe?g|gif|svg|webp)$/i,
          use: [
            {
              loader: 'file-loader',
              options: {}
            }
          ]
        },
        {
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
          use: [
            {
              loader: 'file-loader',
              options: {}
            }
          ]
        },
        {
          test: /\.(webm|mp4|ogv)$/i,
          use: [
            {
              loader: 'file-loader',
              options: {}
            }
          ]
        }
      ]
    },
    optimization: {
      minimizer: [new OptimizeCSSAssetsPlugin()],
      splitChunks: {
        cacheGroups: {
          styles: {
            name: 'styles',
            test: /\.css$/,
            chunks: 'all',
            enforce: true
          }
        }
      }
    },
    plugins: [
      new VueSSRClientPlugin(),
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

export default getDefaultClientWebpackConfig
