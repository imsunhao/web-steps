import { Log } from 'packages/shared'
import { config } from '@web-steps/config'
import path from 'path'

import { requireFromPath } from 'packages/shared'
import semver from 'semver'
import { prompt } from 'enquirer'
import execa from 'execa'
import fs from 'fs'
import { Args, TFILES_MANIFEST } from '@types'
import { createDeploy } from '@web-steps/oss'

const major = 'release'

export let log: Log

function updatePackage(pkgRoot: string, version: any) {
  const pkgPath = path.resolve(pkgRoot, 'package.json')
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))
  pkg.version = version
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n')
}

export async function start(args: Args) {
  const skipTests = args.skipTests
  const skipBuild = args.skipBuild

  const versionIncrements = ['patch', 'minor', 'major', 'prepatch', 'preminor', 'premajor', 'prerelease']

  async function main() {
    log = new Log(major, { env: 'production' })

    const rootDir = args.rootDir
    const packagePath = path.resolve(rootDir, './package.json')
    const currentVersion = requireFromPath(packagePath).version

    const prerelease = semver.prerelease(currentVersion)
    const preId = prerelease ? prerelease[0] : 'alpha'

    const inc = (i: any) => semver.inc(currentVersion, i, preId)
    const step = (msg: string) => log.info(msg)
    const bin = (name: string) => path.resolve(rootDir, './node_modules/.bin/' + name)
    // const run = (bin: string, args: string[] = [], opts = {}) => log.log(`${bin} ${args.join(' ')}`)
    const run = (bin: string, args: any, opts = {}) => execa(bin, args, { stdio: 'inherit', ...opts })

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
      run(bin('jest'), ['--clearCache'])
      run('yarn', ['test'])
    } else {
      console.log(`(skipped)`)
    }

    step('\nUpdating cross dependencies...')
    updatePackage(rootDir, targetVersion)

    step('\nBuilding all packages...')
    if (!skipBuild) {
      run('yarn', ['build'])
    } else {
      console.log(`(skipped)`)
    }

    const doDeploy = async function() {
      // push to origin

      const target = args.minorCommand || 'production'

      step(`\nDeploy to ${target}...`)

      args.args.cache = 'true'
      await config.init(args)

      const {
        userConfigPath: { FILESManifest: FILESManifestPath },
        config: { release }
      } = config

      const FILESManifest: TFILES_MANIFEST = requireFromPath(FILESManifestPath)

      const targetManifestFilePath = path.resolve(rootDir, `./${target}.manifest.json`)

      const targetManifestFile: TFILES_MANIFEST = {} as any

      const deploy = createDeploy(rootDir, target, release)

      const remoteDirPath = `/${target}/`

      const keys = Object.keys(FILESManifest)

      for (let i = 0; i < keys.length; i++) {
        const key: keyof TFILES_MANIFEST = keys[i] as any
        const filePathsList = FILESManifest[key]
        if (!filePathsList || !filePathsList.length) continue
        const md5 = !(key === 'SSR' || key === 'dll' || key === 'template')
        targetManifestFile[key] = await deploy.upload(FILESManifest[key], { remoteDirPath, md5 })
      }

      fs.writeFileSync(targetManifestFilePath, JSON.stringify(targetManifestFile, null, 2), 'utf-8')

      console.log(targetManifestFile)

      return {
        deploy
      }
    }

    await doDeploy()

    step('\nGit changelog...')

    run(`yarn`, ['changelog'])

    run('git', ['diff'], { stdio: 'pipe' })
    step('\nCommitting changes...')
    run('git', ['add', '-A'])
    run('git', ['commit', '-m', `release: v${targetVersion}`])
  }

  await main().catch(err => log.catchError(err))
}
