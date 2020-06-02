import { Tstore } from './type'

import Vue from 'vue'
import Vuex, { Store } from 'vuex'

import actions, { dispatch, TActions } from './actions'
import mutations, { commit, getState, TMutations } from './mutations'
import getters, { getGetter } from './getters'

function state(): Tstore.state {
  return {
    count: 0,
    user: {
      test: '1111111'
    }
  }
}

Vue.use(Vuex)

let store: Store<Tstore.state>

/// <RemoveCodeBlock=server-production>
import { webpackHelper } from '@web-steps/helper-webpack'
webpackHelper.hotReload(
  module,
  () => (require as any).context('.', true, /(?<!\.d)\.ts/),
  ({ requrie }) => {
    store.hotUpdate({
      getters: requrie('./getters.ts'),
      actions: requrie('./actions.ts'),
      mutations: requrie('./mutations.ts')
    })
    console.log('Vuex hot reload')
  }
)
/// </RemoveCodeBlock=server-production>

export function createStore() {
  store = new Vuex.Store<Tstore.state>({
    state: state(),
    actions,
    mutations,
    getters
  })
  return store
}

export { commit, getState, dispatch, getGetter }

export type GlobalMutations = TMutations
export type GlobalActions = TActions
