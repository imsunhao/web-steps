import VueSSRClientPlugin from 'vue-server-renderer/client-plugin'
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import webpack from 'webpack'
import { TGetWebpackConfig } from '@web-steps/config'

const getDefaultClientWebpackConfig: TGetWebpackConfig = function({ args: { env } }) {
  const isProd = env === 'production'
  return {
    name: 'client',
    module: {
      rules: [
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
        'process.env.VUE_ENV': '"client"'
      })
    ]
  }
}

export default getDefaultClientWebpackConfig
