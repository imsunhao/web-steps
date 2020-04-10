import { Log } from 'packages/shared'
import { config } from '@web-steps/config'
import path from 'path'

import { requireFromPath } from 'shared/require'
import semver from 'semver'
import { prompt } from 'enquirer'
import execa from 'execa'
import fs from 'fs'
import { Args, TFILES_MANIFEST, DOWNLOAD_MANIFEST_FILE } from '@types'
import { createDeploy } from './utils/deploy'

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
  const skipDeploy = args.skipDeploy
  const skipChangelog = args.skipChangelog
  const skipPush = args.skipPush
  const skipRunBin = args.skipRunBin

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
      await run(bin('jest'), ['--clearCache'])
      await run('yarn', ['test'])
    } else {
      log.info(`(skipped)`)
    }

    step('\nUpdating cross dependencies...')
    updatePackage(rootDir, targetVersion)

    step('\nBuilding all packages...')
    if (!skipBuild) {
      await run('yarn', ['build'])
    } else {
      log.info(`(skipped)`)
    }

    const target = args.minorCommand || 'production'

    step(`\nDeploy to ${target}...`)

    const doDeploy = async function() {
      args.args.cache = 'true'
      await config.init(args)

      const {
        userConfigPath: { FILESManifest: FILESManifestPath },
        config: { release }
      } = config

      const FILESManifest: TFILES_MANIFEST = requireFromPath(FILESManifestPath)

      const targetManifestFilePath = path.resolve(rootDir, `./${target}.manifest.json`)

      const downloadManifestPath: DOWNLOAD_MANIFEST_FILE = {} as any

      const deploy = createDeploy(rootDir, target, release)

      const keys = Object.keys(FILESManifest)

      for (let i = 0; i < keys.length; i++) {
        const key: keyof TFILES_MANIFEST = keys[i] as any
        const filePathsList = FILESManifest[key]
        if (!filePathsList || !filePathsList.length) continue
        const md5 = !(key === 'SSR' || key === 'dll' || key === 'static')
        downloadManifestPath[key] = await deploy.upload(FILESManifest[key], {
          remoteDirPath: '/',
          md5
        })
      }

      downloadManifestPath.oss = {
        name: deploy.OSS.name,
        options: deploy.OSS.options
      }

      fs.writeFileSync(targetManifestFilePath, JSON.stringify(downloadManifestPath, null, 2), 'utf-8')

      log.log('targetManifestFilePath =', targetManifestFilePath)
    }

    if (!skipDeploy) {
      await doDeploy()
    } else {
      log.info(`(skipped)`)
    }

    step('\nGit changelog...')

    if (!skipChangelog) {
      await run(`yarn`, ['changelog'])
    } else {
      log.info(`(skipped)`)
    }

    step('\nPushing to GitHub...')

    if (!skipPush) {
      const { stdout } = await run('git', ['diff'], { stdio: 'pipe' })
      if (stdout) {
        step('\nCommitting changes...')
        await run('git', ['add', '-A'])
        await run('git', ['commit', '-m', `release: v${targetVersion}`])
      } else {
        log.info('No changes to commit.')
      }

      // push to GitHub
      await run('git', ['tag', `v${targetVersion}`])
      await run('git', ['push', 'origin', `refs/tags/v${targetVersion}`])
      await run('git', ['push', '--set-upstream', 'origin', 'master'])
    } else {
      log.info(`(skipped)`)
    }

    step('\nRun Bin...')

    if (!skipRunBin) {
      args.args.cache = 'true'
      await config.init(args)
      const target = args.minorCommand || 'production'

      const {
        config: { release }
      } = config
      const bin = release.target[target].bin

      if (bin) {
        let cmd = ''
        if (typeof bin === 'function') {
          const { stdout: gitHash } = await run('git', ['rev-parse', '--short', 'HEAD'], { stdio: 'pipe' })
          if (gitHash) {
            const downloadManifestPath = path.resolve(rootDir, `./${target}.manifest.json`)
            cmd = bin({ gitHash, downloadManifestPath })
          } else {
            log.error('can not get git hash!')
          }
        } else {
          cmd = bin
        }

        const cmds = cmd.split(' ')
        await run(cmds[0], cmds.slice(1, cmds.length))
      } else {
        log.info(`bin not find (skipped)`)
      }
    } else {
      log.info(`(skipped)`)
    }
  }

  await main().catch(err => log.catchError(err))
}
