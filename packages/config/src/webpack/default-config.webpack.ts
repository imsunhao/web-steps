import { Configuration } from 'webpack'
import nodeExternals from 'webpack-node-externals'
import webpackMerge from 'webpack-merge'

export default function(name: string, entryPath: string, outputPath: string, base: Configuration = {}) {
  return webpackMerge(
    {
      resolve: base.resolve
    },
    {
      name,
      mode: 'production',
      devtool: false,
      target: 'node',
      optimization: {
        minimize: false
      },
      entry: {
        [name]: entryPath
      },
      output: {
        path: outputPath,
        filename: '[name].js',
        libraryTarget: 'commonjs2'
      },
      externals: [nodeExternals()],
      resolve: {
        extensions: ['.ts', '.js', '.json']
      },
      module: {
        rules: [
          {
            test: /\.tsx?$/,
            exclude: /node_modules/,
            use: ['ts-loader']
          }
        ]
      }
    }
  )
}
