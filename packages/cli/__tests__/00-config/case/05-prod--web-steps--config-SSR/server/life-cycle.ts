import { GetUserServerConfig } from '@web-steps/config'
const getServerConfig: GetUserServerConfig = () => {
  return {
    beforeCreated() {
      console.log('beforeCreated')
    },
    beforeRender() {
      console.log('beforeRender')
    }
  }
}
export default getServerConfig
