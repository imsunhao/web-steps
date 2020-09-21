/* eslint-disable jest/no-try-expect */
import { TDescribeSetting } from './types'
import { Execa, RunOptions } from 'shared/node'
import path from 'path'
import { copyFolderRecursiveSync, deleteFolder } from 'shared/fs'
import { ProcessMessage } from '@types'

const resolve = (p: string) => path.resolve(process.cwd(), p)

let describeIndex = 0
let port = 37000

function prefixInteger(num: number, length: number) {
  return (Array(length).join('0') + num).slice(-length)
}

const timeout = 150000

export function makeWebStepsTests(
  { name, tests, onMessage, submodule }: TDescribeSetting,
  runOptions: RunOptions = {},
  args: any = {}
) {
  const { case: caseName } = args
  const isSkipByCaseName = (name: string) => {
    return name && caseName && !name.includes(caseName)
  }
  name = `${prefixInteger(describeIndex++, 2)}-${name}`
  let init = false
  async function initializeTests() {
    const submodulePath = resolve(submodule)
    const testsDirPath = resolve('__tests__/.cache')
    const { stdout: ABBREV_REF_HEAD } = await Execa.run(
      'bash',
      [resolve('__tests__/bin/ABBREV_REF_HEAD.sh'), submodulePath],
      {
        ...runOptions,
        stdio: 'pipe'
      }
    )

    const gitFinish = async () => {
      await Execa.run('bash', [resolve('__tests__/bin/GIT_CHECKOUT.sh'), submodulePath, ABBREV_REF_HEAD], runOptions)
      init = true
    }

    try {
      for (let i = 0; i < tests.length; i++) {
        const t = tests[i]
        if (isSkipByCaseName(t.name)) continue
        t.name = `${prefixInteger(i, 2)}-${t.name}`
        await Execa.run('bash', [resolve('__tests__/bin/GIT_CHECKOUT.sh'), submodulePath, t.hash], runOptions)

        t.rootDir = t.rootDir || path.resolve(testsDirPath, name, t.name)
        t.port = port++

        if (runOptions.isRead) {
          console.log('清空目录', t.rootDir)
          console.log('copyFolderRecursiveSync', submodulePath, t.rootDir)
        } else {
          deleteFolder(t.rootDir)
          copyFolderRecursiveSync(submodulePath, t.rootDir)
        }
      }
      await gitFinish()
      expect(1).toEqual(1)
    } catch (err) {
      console.error(err)
      await gitFinish()
      expect(0).toEqual(1)
    }
  }
  describe(name, () => {
    beforeEach(async done => {
      if (!init) {
        await initializeTests()
      }
      done()
    })

    tests.forEach(t => {
      if (t.skip || (__DEBUG_PORT__ && !t.debug) || isSkipByCaseName(t.name)) {
        test.skip(t.name, () => {})
        return
      }
      if (__DEBUG_PORT__) console.log('[DEBUG]', t.name)
      test(
        t.name,
        done => {
          const onMessageFn = t.onMessage || onMessage
          const { rootDir, port } = t

          const { major, cache, env, argv, target } = t.web_steps

          const nodeArgv: string[] = [
            'packages/cli/bin/web-steps',
            major,
            `--root-dir=${rootDir}`,
            `--cache=${cache}`,
            target ? `--target=${target}` : '',
            `--env=${env}`,
            `--port=${port}`,
            ...argv
          ]
          const childProcess = Execa.runNodeIPC(nodeArgv, { ...runOptions, envs: t.envs })
          if (!('on' in childProcess)) return done()

          childProcess.on('message', (message: ProcessMessage) => {
            if (!runOptions.isSilence) console.log('[单元测试] key =', message.key)
            onMessageFn({ message, test: t, done, childProcess })
          })

          childProcess.on('close', code => {
            if (!runOptions.isSilence) console.log('[单元测试] childProcess on close')
            expect(code).toEqual(0)
            done()
          })
        },
        __DEBUG_PORT__ ? 6000000 : timeout
      )
    })
  })
}

export * from './types'
export * from './docker'

// export class WebStepsInspect {
//   constructor(submodule: string) {}

//   makeWrapper() {}
// }
