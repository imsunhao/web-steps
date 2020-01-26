/*
Run Rollup in watch mode for development.

To specific the package to watch, simply pass its name and the desired build
formats to watch (defaults to "all"):

```
# name supports fuzzy match. will watch all packages with name containing "dom"
yarn dev dom

# specify the format to output
yarn dev core --formats cjs
```
*/

const path = require('path')
const fs = require('fs')
const chalk = require('chalk')
const execa = require('execa')
const chokidar = require('chokidar')
const { targets: allTargets, fuzzyMatchTarget } = require('./utils')
const args = require('minimist')(process.argv.slice(2))

const targets = args._.length ? fuzzyMatchTarget(args._) : allTargets
const formats = args.formats || args.f
const commit = execa.sync('git', ['rev-parse', 'HEAD']).stdout.slice(0, 7)
const devOnly = args.devOnly || args.d
const buildTypes = args.t || args.types

targets.forEach(target => {
  const pkgDir = path.resolve(`packages/${target}`)
  const pkg = require(`${pkgDir}/package.json`)

  const env = (pkg.buildOptions && pkg.buildOptions.env) || (devOnly ? 'development' : 'production')
  execa(
    'rollup',
    [
      '-wc',
      '--environment',
      [
        `COMMIT:${commit}`,
        `NODE_ENV:${env}`,
        `TARGET:${target}`,
        `FORMATS:${formats || 'cjs'}`,
        buildTypes ? `TYPES:true` : ``
      ]
        .filter(Boolean)
        .join(',')
    ],
    {
      stdio: 'inherit'
    }
  )
  if (buildTypes && pkg.types) {
    const watcher = chokidar.watch(`packages/${target}/dist/index.js`, {
      persistent: true,
      usePolling: false,
      interval: 1000,
      binaryInterval: 300,
      alwaysStat: false,
      depth: 1
    })
    watcher.on('change', async () => {
      console.log()
      console.log(chalk.bold(chalk.yellow(`Rolling up type definitions for ${target}...`)))

      // build types
      const { Extractor, ExtractorConfig } = require('@microsoft/api-extractor')

      const extractorConfigPath = path.resolve(pkgDir, `api-extractor.json`)
      const extractorConfig = ExtractorConfig.loadFileAndPrepare(extractorConfigPath)
      const result = Extractor.invoke(extractorConfig, {
        localBuild: true,
        showVerboseMessages: true
      })

      if (result.succeeded) {
        console.log(chalk.bold(chalk.green(`API Extractor completed successfully.`)))
      } else {
        console.error(
          `API Extractor completed with ${extractorResult.errorCount} errors` +
            ` and ${extractorResult.warningCount} warnings`
        )
      }
    })
  }
})
