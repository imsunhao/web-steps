import { globalHelper } from './helpers'
import { Tstore } from './type'
import { APITest } from '../../@types'

export const mutations = globalHelper.makeMutations({
  SET_USER: (state, user?: Tstore.state['user']) => {
    state.user = user
  },
  ADD_NUMBER: (state, number: number) => {
    state.count += number
  },
  SET_API: (state, data: APITest) => {
    state.api[data.test] = !!data.test
  }
})

export default mutations

export type TMutations = typeof mutations

export const commit = globalHelper.createCommit<Tstore.Mutations>()
export const getState = globalHelper.createGetState()
