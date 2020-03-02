import { Args } from '@types'
import path from 'path'
import { log } from './'
import { requireFromPath } from 'packages/shared'
import semver from 'semver'
import { prompt } from 'enquirer'
import execa from 'execa'
import fs from 'fs'

function updatePackage(pkgRoot: string, version: any) {
  const pkgPath = path.resolve(pkgRoot, 'package.json')
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))
  pkg.version = version
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n')
}

export function start(args: Args) {
  // const setting = getSetting(args)
  // const FILESManifest = path.resolve(setting.output, 'files-manifest.json')
  // console.log(FILESManifest)

  const rootDir = args.rootDir
  const currentVersion = requireFromPath(path.resolve(rootDir, '../package.json')).version
  const preId = semver.prerelease(currentVersion)[0] || 'alpha'

  const skipTests = args.skipTests
  const skipBuild = args.skipBuild
  const versionIncrements = ['patch', 'minor', 'major', 'prepatch', 'preminor', 'premajor', 'prerelease']

  const inc = (i: any) => semver.inc(currentVersion, i, preId)
  const step = (msg: string) => log.info(msg)
  const bin = (name: string) => path.resolve(__dirname, '../node_modules/.bin/' + name)
  const run = (bin: string, args: any, opts = {}) => execa(bin, args, { stdio: 'inherit', ...opts })

  async function main() {
    let targetVersion: string

    const { release } = await prompt({
      type: 'select',
      name: 'release',
      message: 'Select release type',
      choices: versionIncrements.map(i => `${i} (${inc(i)})`).concat(['custom'])
    })

    if (release === 'custom') {
      targetVersion = (await prompt<{ version: string }>({
        type: 'input',
        name: 'version',
        message: 'Input custom version',
        initial: currentVersion
      })).version
    } else {
      targetVersion = release.match(/\((.*)\)/)[1]
    }

    if (!semver.valid(targetVersion)) {
      throw new Error(`invalid target version: ${targetVersion}`)
    }

    const { yes } = await prompt({
      type: 'confirm',
      name: 'yes',
      message: `Releasing v${targetVersion}. Confirm?`
    })

    if (!yes) {
      return
    }

    step('\nRunning tests...')
    if (!skipTests) {
      await run(bin('jest'), ['--clearCache'])
      await run('yarn', ['test'])
    } else {
      console.log(`(skipped)`)
    }

    step('\nUpdating cross dependencies...')
    updatePackage(rootDir, targetVersion)

    step('\nBuilding all packages...')
    if (!skipBuild) {
      await run('yarn', ['build'])
    } else {
      console.log(`(skipped)`)
    }

    await run(`yarn`, ['changelog'])

    const { stdout } = await run('git', ['diff'], { stdio: 'pipe' })
    if (stdout) {
      step('\nCommitting changes...')
      await run('git', ['add', '-A'])
      await run('git', ['commit', '-m', `release: v${targetVersion}`])
    } else {
      console.log('No changes to commit.')
    }

    // push to origin
    step('\nPushing to GitHub...')
    await run('git', ['tag', `v${targetVersion}`])
    await run('git', ['push', 'origin', `refs/tags/v${targetVersion}`])
    await run('git', ['push'])
  }
  main().catch(e => log.catchError(e))
}
