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
