import { Tstore } from './type'
import { VuexStoreHelper } from '@web-steps/helper-vuex'

export const { makeWrapper } = new VuexStoreHelper<Tstore.state, Tstore.getters>()

export const globalHelper = makeWrapper()
