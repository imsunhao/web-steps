module.exports = {
  root: true,
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    tsconfigRootDir: __dirname,
    extraFileExtensions: ['.vue'],
    project: ['./tsconfig.json']
  },
  plugins: ['@typescript-eslint', 'jest', 'vue', 'html'],
  env: {
    es6: true,
    node: true,
    'jest/globals': true
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'prettier/@typescript-eslint',
    'plugin:jest/recommended',
    'plugin:vue/base',
    'plugin:vue/essential'
  ],
  rules: {
    'no-case-declarations': 'off',
    'no-debugger': 'warn',
    'no-empty': 'warn',
    'jest/no-disabled-tests': 'off',
    'jest/no-export': 'off',
    'jest/no-standalone-expect': 'off',
    '@typescript-eslint/no-this-alias': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'off'
  },
  globals: {
    __webpack_require__: 'readonly'
  }
}
