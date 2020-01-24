/*
Run Rollup in watch mode for development.

To specific the package to watch, simply pass its name and the desired build
formats to watch (defaults to "all"):

```
# name supports fuzzy match. will watch all packages with name containing "dom"
yarn dev dom

# specify the format to output
yarn dev core --formats cjs

# Can also drop all __DEV__ blocks with:
__DEV__=false yarn dev
```
*/

const execa = require('execa')
const { targets: allTargets, fuzzyMatchTarget } = require('./utils')
const args = require('minimist')(process.argv.slice(2))

const targets = args._.length ? fuzzyMatchTarget(args._) : allTargets
const formats = args.formats || args.f
const commit = execa.sync('git', ['rev-parse', 'HEAD']).stdout.slice(0, 7)

targets.forEach(target => {
  execa(
    'rollup',
    ['-wc', '--environment', [`COMMIT:${commit}`, `TARGET:${target}`, `FORMATS:${formats || 'cjs'}`].join(',')],
    {
      stdio: 'inherit'
    }
  )
})
