import { Tstore } from './type'

import Vue from 'vue'
import Vuex from 'vuex'

import actions, { dispatch, TActions } from './actions'
import mutations, { commit, getState, TMutations } from './mutations'
import getters, { getGetter } from './getters'

function state(): Tstore.state {
  return {
    user: {
      test: ''
    }
  }
}

Vue.use(Vuex)

export function createStore() {
  return new Vuex.Store<Tstore.state>({
    state: state(),
    actions,
    mutations,
    getters
  })
}

export { commit, getState, dispatch, getGetter }

export type GlobalMutations = TMutations
export type GlobalActions = TActions
