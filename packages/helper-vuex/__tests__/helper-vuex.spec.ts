import { createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import { VuexStoreHelper } from '../src'
import { merge } from 'lodash'
import TestStore from './type'

const { makeWrapper } = new VuexStoreHelper<TestStore.State, TestStore.Getters>()
const DEFAULT_TEST_STRING = 'DEFAULT_TEST_STRING'
const DEFAULT_TEST_NUMBER = 1

describe('Vux', () => {
  const localVue = createLocalVue()

  function getTestState(): TestStore.State['test'] {
    return {
      test: DEFAULT_TEST_STRING,
      testNumber: 0,
      deepTest: {
        test1: DEFAULT_TEST_STRING,
        test2: 2
      }
    }
  }

  localVue.use(Vuex)

  const getStore = <T>(options = {}) => {
    return new Vuex.Store<T>(
      merge(
        {
          state: {
            test: getTestState()
          }
        } as any,
        options
      )
    )
  }

  describe('全局测试', () => {
    const globalHelper = makeWrapper()
    const mutations = globalHelper.makeMutations({
      SET_SET: (state, test: string) => {
        state.test.test = test
      }
    })
    const getters = globalHelper.makeGetters({
      globleValue() {
        return DEFAULT_TEST_NUMBER
      }
    })
    const getState = globalHelper.createGetState()
    const commit = globalHelper.createCommit<typeof mutations>()

    it('getGetter', () => {
      const getGetter = globalHelper.createGetGetter()
      const store = getStore<TestStore.State>({ mutations, getters })
      const value = getGetter(store, 'globleValue')
      expect(value).toEqual(DEFAULT_TEST_NUMBER)
    })

    it('commit getState', () => {
      const store = getStore<TestStore.State>({ mutations })
      const testString = 'hi'

      expect(store.state.test.test).toEqual(DEFAULT_TEST_STRING)

      commit(store, 'SET_SET', testString)

      expect(store.state.test.test).toEqual(testString)

      expect(getState(store, 'test', 'test')).toEqual(testString)
    })

    const actions = globalHelper.makeActions({
      ACTION_SET(ctx, { test }: { test: string }) {
        ctx.getters.globleValue
        commit(ctx, 'SET_SET', test)
      },
      ACTION_TEST_GETTERS(ctx) {
        expect(ctx.getters.globleValue).toEqual(DEFAULT_TEST_NUMBER)
      }
    })
    const dispatch = globalHelper.createDispatch<typeof actions>()

    it('dispatch', () => {
      const store = getStore<TestStore.State>({ mutations, getters, actions })
      const testString = 'hi'

      expect(store.state.test.test).toEqual(DEFAULT_TEST_STRING)

      dispatch(store, 'ACTION_SET', { test: testString })

      dispatch(store, 'ACTION_TEST_GETTERS', undefined)

      expect(getState(store, 'test', 'test')).toEqual(testString)
    })
  })

  const VUEX_NS_1 = 'test'
  type VUEX_NS_1 = typeof VUEX_NS_1

  describe('单模块测试', () => {
    const testHelper = makeWrapper<TestStore.State[VUEX_NS_1], TestStore.Getters[VUEX_NS_1]>(VUEX_NS_1)
    const mutations = testHelper.makeMutations({
      SET_SET: (state, test: string) => {
        state.test = test
      }
    })
    const getState = testHelper.createGetState()
    const commit = testHelper.createCommit<typeof mutations>()

    it('commit getState', () => {
      const store = getStore<TestStore.State>({
        state: {},
        modules: { test: { namespaced: true, state: getTestState(), mutations } }
      })
      const testString = 'hi'

      expect(store.state.test.test).toEqual(DEFAULT_TEST_STRING)
      expect(store.state.test.test).toEqual(DEFAULT_TEST_STRING)

      commit(store, 'SET_SET', testString)

      expect(store.state.test.test).toEqual(testString)

      expect(getState(store, 'test')).toEqual(testString)
    })

    const getters = testHelper.makeGetters({
      getTest() {
        return DEFAULT_TEST_STRING
      },
      getTestNumber() {
        return DEFAULT_TEST_NUMBER
      }
    })
    it('getGetter', () => {
      const store = getStore<TestStore.State>({
        state: {},
        modules: { test: { namespaced: true, state: getTestState(), mutations, getters } }
      })
      const getGetter = testHelper.createGetGetter()
      expect(getGetter(store, 'getTest')).toEqual(DEFAULT_TEST_STRING)
      expect(getGetter(store, 'getTestNumber')).toEqual(DEFAULT_TEST_NUMBER)
    })

    const actions = testHelper.makeActions({
      ACTION_SET(ctx, { test }: { test: string }) {
        commit(ctx, 'SET_SET', test)
      }
    })
    const dispatch = testHelper.createDispatch<typeof actions>()

    it('dispatch', () => {
      const store = getStore<TestStore.State>({
        state: {},
        modules: { test: { namespaced: true, state: getTestState(), mutations, actions } }
      })
      const testString = 'hi'

      expect(store.state.test.test).toEqual(DEFAULT_TEST_STRING)

      dispatch(store, 'ACTION_SET', { test: testString })

      expect(getState(store, 'test')).toEqual(testString)
    })
  })

  const VUEX_NS_1_1 = 'deepTest'
  type VUEX_NS_1_1 = typeof VUEX_NS_1_1

  describe('深模块(2层)测试', () => {
    const testHelper = makeWrapper<TestStore.State[VUEX_NS_1][VUEX_NS_1_1], TestStore.Getters[VUEX_NS_1][VUEX_NS_1_1]>([
      VUEX_NS_1,
      VUEX_NS_1_1
    ])
    const mutations = testHelper.makeMutations({
      SET_SET: (state, test: string) => {
        state.test1 = test
      }
    })
    const getState = testHelper.createGetState()
    const commit = testHelper.createCommit<typeof mutations>()

    it('commit getState', () => {
      const store = getStore<TestStore.State>({
        state: {},
        modules: {
          test: {
            namespaced: true,
            state: {},
            modules: { deepTest: { namespaced: true, state: getTestState().deepTest, mutations } }
          }
        }
      })
      const testString = 'hi'

      expect(store.state.test.deepTest.test1).toEqual(DEFAULT_TEST_STRING)

      commit(store, 'SET_SET', testString)

      expect(store.state.test.deepTest.test1).toEqual(testString)

      expect(getState(store, 'test1')).toEqual(testString)
    })

    it('getGetter', () => {
      const getters = testHelper.makeGetters({
        getTest() {
          return DEFAULT_TEST_STRING
        },
        getTestNumber() {
          return DEFAULT_TEST_NUMBER
        }
      })
      const store = getStore<TestStore.State>({
        state: {},
        modules: {
          test: {
            namespaced: true,
            state: {},
            modules: { deepTest: { namespaced: true, state: getTestState().deepTest, mutations, getters } }
          }
        }
      })
      const getGetter = testHelper.createGetGetter()
      expect(getGetter(store, 'getTest')).toEqual(DEFAULT_TEST_STRING)
      expect(getGetter(store, 'getTestNumber')).toEqual(DEFAULT_TEST_NUMBER)
    })

    const actions = testHelper.makeActions({
      ACTION_SET(ctx, { test }: { test: string }) {
        commit(ctx, 'SET_SET', test)
      }
    })
    const dispatch = testHelper.createDispatch<typeof actions>()

    it('dispatch', () => {
      const store = getStore<TestStore.State>({
        state: {},
        modules: {
          test: {
            namespaced: true,
            state: {},
            modules: { deepTest: { namespaced: true, state: getTestState().deepTest, mutations, actions } }
          }
        }
      })
      const testString = 'hi'

      expect(store.state.test.deepTest.test1).toEqual(DEFAULT_TEST_STRING)

      dispatch(store, 'ACTION_SET', { test: testString })

      expect(getState(store, 'test1')).toEqual(testString)
    })
  })

  describe('local getter', () => {
    const globalHelper = makeWrapper()
    type testLocalGetters = {
      globleValue: number
    }
    const localGetters = globalHelper.makeGetters<testLocalGetters>({
      globleValue() {
        return DEFAULT_TEST_NUMBER
      }
    })
    const getters = globalHelper.makeGetters({
      ...localGetters
    })

    it('getGetter', () => {
      const getGetter = globalHelper.createGetGetter()
      const store = getStore<TestStore.State>({ getters })
      const value = getGetter(store, 'globleValue')
      expect(value).toEqual(DEFAULT_TEST_NUMBER)
    })
  })
})
