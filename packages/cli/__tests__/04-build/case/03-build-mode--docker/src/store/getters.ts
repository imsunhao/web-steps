import { globalHelper } from './helpers'

export const getters = globalHelper.makeGetters({
  hasUser(state) {
    // console.log('hasUser', state, state.user)
    return !!state.user
  }
})

export default getters

export const getGetter = globalHelper.createGetGetter()
