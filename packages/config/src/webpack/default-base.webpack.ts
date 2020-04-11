import { VueLoaderPlugin } from 'vue-loader'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import TerserPlugin from 'terser-webpack-plugin'
import { TGetWebpackConfig } from '@web-steps/config'
import webpack from 'webpack'
import { TERSER_PLUGIN_OPTIONS } from '../setting'

const getConfig: TGetWebpackConfig = function({ args: { env, rootDir }, resolve }) {
  const base: webpack.Configuration = {
    mode: env,
    context: rootDir,
    resolve: {
      extensions: ['.ts', '.js', '.vue', '.json'],
      alias: {
        assets: resolve('assets'),
        src: resolve('src'),
        static: resolve('static'),
        stories: resolve('stories')
      }
    },
    output: {
      filename: '[name].[chunkhash].js'
    },
    optimization: {
      minimizer: [new TerserPlugin(TERSER_PLUGIN_OPTIONS)]
    },
    module: {
      noParse: /es6-promise\.js$/,
      rules: [
        {
          test: /\.vue$/,
          loader: 'vue-loader',
          options: {
            compilerOptions: {
              preserveWhitespace: false
            }
          }
        }
      ]
    },
    plugins: [
      new VueLoaderPlugin(),
      new MiniCssExtractPlugin({
        filename: '[contenthash].css',
        ignoreOrder: true
      })
    ]
  }

  return base
}

export default getConfig
