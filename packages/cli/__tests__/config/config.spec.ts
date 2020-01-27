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
  close?: boolean
}

const run = new Run()

describe('config', () => {
  const cases = readdirSync(caseDir)

  cases.forEach(caseName => {
    test(`case: ${caseName}`, done => {
      const childProcess = run.runNodeIPC([
        'packages/cli/bin/web-steps',
        `--root-dir=${resolve(__dirname, 'case', caseName)}`
      ])

      const result: TestResult = require(`./case/${caseName}/test-result`).default

      childProcess.on('message', message => {
        // console.log('[父亲]', message)
        const { name, data } = message as any
        const rule = (result as any).config.result[name]
        if (rule) {
          if (result.config) {
            expect(data).toMatchObject(rule)
          }
        }
      })

      childProcess.on('close', code => {
        if (result.close) {
          expect(code).toEqual(0)
        }
        done()
      })
    })
  })
})
