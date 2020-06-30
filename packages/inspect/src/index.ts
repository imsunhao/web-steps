/* eslint-disable jest/no-try-expect */
import { TDescribeSetting } from './types'
import { Execa, RunOptions } from 'shared/node'
import path from 'path'
import { copyFolderRecursiveSync, deleteFolder } from 'shared/fs'

const resolve = (p: string) => path.resolve(process.cwd(), p)

let describeIndex = 0

function prefixInteger(num: number, length: number) {
  return (Array(length).join('0') + num).slice(-length)
}

export function makeWebStepsTests(
  { name, tests, major, onMessage, submodule }: TDescribeSetting,
  runOptions: RunOptions = {}
) {
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
        t.name = `${prefixInteger(i, 2)}-${t.name}`
        await Execa.run('bash', [resolve('__tests__/bin/GIT_CHECKOUT.sh'), submodulePath, t.hash], runOptions)
        t.rootDir = t.rootDir || path.resolve(testsDirPath, name, t.name)
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
      test(
        t.name,
        done => {
          t.web_steps.path = t.rootDir
          const a = '1'
          setTimeout(() => {
            expect(a).toEqual('1')
            done()
          }, 2000)
        },
        3000
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
