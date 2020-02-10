import nodeExternals from 'webpack-node-externals'

export default function(name: string, entryPath: string, outputPath: string) {
  return {
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
}
