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
        list: exclude
      })
    ]
  }
}

export default getDefaultClientWebpackConfig
