import { readdirSync } from 'fs'
import { resolve } from 'path'
// import { readFileSync, existsSync } from 'fs'
import { Execa } from '../../src/utils/node'
import { ProcessMessage } from '@types'

const caseDir = resolve(__dirname, 'case')

describe('config', () => {
  readdirSync(caseDir).forEach(caseName => {
    test(`case: ${caseName}`, done => {
      const childProcess = Execa.runNodeIPC(
        ['packages/cli/bin/web-steps', 'test', `--root-dir=${resolve(__dirname, 'case', caseName)}`],
        { isRead: false, isSilence: true }
      )
      if (!childProcess.on) return done()

      const testConfig: TestConfig = require(`./case/${caseName}/test-confg`).default

      childProcess.on('message', (message: ProcessMessage) => {
        // console.log('[父亲]', message)
        const { name, payload } = message
        const rule = (testConfig as any).config.result[name]
        if (rule) {
          if (testConfig.config) {
            expect(payload).toMatchObject(rule)
          }
        }
      })

      childProcess.on('close', code => {
        if (testConfig.close) {
          expect(code).toEqual(0)
        }
        done()
      })
    })
  })
})

type TestConfig = {
  config?: {
    result: {
      getUserConfig: any
    }
  }
  close?: boolean
}
