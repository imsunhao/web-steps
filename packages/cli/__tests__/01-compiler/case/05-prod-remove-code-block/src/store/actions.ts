import { Tstore } from './type'

import { globalHelper } from './helpers'

import { commit } from '../store'

export const actions = globalHelper.makeActions({
  /**
   * 获取 project-detail 数据，然后初始化所有相应 state 数据
   */
  async FETCH_USER(ctx, payload: Tstore.state['user']) {
    commit(ctx, 'SET_USER', payload)
    async function aaa() {}
    await aaa()
  }
})

export default actions

export type TActions = typeof actions

export const dispatch = globalHelper.createDispatch<Tstore.Actions>()
