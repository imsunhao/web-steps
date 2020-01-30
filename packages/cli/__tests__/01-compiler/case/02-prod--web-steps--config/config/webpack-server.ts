import { StartupOptions } from '@web-steps/config'

const getConfig = function(startupOptions: StartupOptions) {
  const { resolve } = startupOptions
  return {
    name: 'server',
    mode: 'production',
    devtool: false,
    target: 'node',
    optimization: {
      minimize: false
    },
    entry: {
      index: resolve('./src/index.ts')
    },
    output: {
      path: resolve('./dist'),
      filename: 'server.js',
      libraryTarget: 'commonjs2'
    },
    resolve: {
      extensions: ['.ts', '.js']
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: ['ts-loader']
        }
      ]
    },
    plugins: []
  }
}

export default getConfig
