import { Tstore } from './type'
import { VuexStoreHelper } from '@web-steps/helper'

export const { makeWrapper } = new VuexStoreHelper<Tstore.state, Tstore.getters>()

export const globalHelper = makeWrapper()
