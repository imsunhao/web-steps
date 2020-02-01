import nodeExternals from 'webpack-node-externals'

export default function(entryPath: string, outputPath: string) {
  return {
    name: 'config',
    mode: 'production',
    devtool: false,
    target: 'node',
    optimization: {
      minimize: false
    },
    entry: {
      config: entryPath
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
    },
    plugins: []
  }
}
