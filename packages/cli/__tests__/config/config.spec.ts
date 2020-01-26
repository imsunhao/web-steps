import { readdirSync } from 'fs'
import { resolve } from 'path'
// import { readFileSync, existsSync } from 'fs'
import { Run } from '../../src'

const caseDir = resolve(__dirname, 'case')

type TestResult = {
  config?: {
    result: {
      getUserConfig: any
    }
  }
}

const run = new Run()

describe('config', () => {
  const cases = readdirSync(caseDir)

  cases.forEach(caseName => {
    test(`case: ${caseName}`, done => {
      const childProcess = run.runNodeIpc([
        'packages/cli/bin/web-steps',
        `--root-dir=${resolve(__dirname, 'case', caseName)}`
      ])

      const result: TestResult = require(`./case/${caseName}/test-result`).default

      if (result.config) {
        childProcess.on('message', message => {
          // console.log('[父亲]', message)
          const { name, data } = message as any
          const rule = (result as any).config.result[name]
          if (rule) {
            expect(rule).toEqual(data)
          }
        })
      }

      childProcess.on('close', code => {
        expect(code).toEqual(0)
        done()
      })
    })
  })
})
