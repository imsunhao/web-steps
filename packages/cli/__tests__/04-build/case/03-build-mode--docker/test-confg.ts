import { TTestConfig } from '../../../utils'
import { resolve } from 'path'
const debug = false
const testConfig: TTestConfig = {
  vscodeDebug: debug,
  skip: false,
  node: {
    target: 'web-steps',
    rootDir: resolve(__dirname)
  },
  result: {
    docker: {
      path: resolve(__dirname, './dist/web-steps/Dockerfile'),
      content: `COPY dist/web-steps/start-config.js $workspace/dist/web-steps/start-config.js
COPY dist/web-steps/vue-ssr-client-manifest.json $workspace/dist/web-steps/vue-ssr-client-manifest.json
COPY dist/web-steps/vue-ssr-server-bundle.json $workspace/dist/web-steps/vue-ssr-server-bundle.json`
    }
  },
  close: true
}

export default testConfig
