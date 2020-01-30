const TEST_CONFIG_1 = ({ resolve }) => {
  return {
    name: 'test-config-1',
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
      filename: 'test-config-1.js',
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

const TEST_CONFIG_2 = ({ resolve }) => {
  return {
    name: 'test-config-2',
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
      filename: 'test-config-2.js',
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

module.exports = function() {
  return {
    test: '01-prod--web-steps',
    customBuild: [TEST_CONFIG_1, TEST_CONFIG_2]
  }
}
