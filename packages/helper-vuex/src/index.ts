import { getHostGlobal } from 'shared/SSR'
import { Module, Store, MutationTree, Commit, Dispatch } from 'vuex'

export type VUEX_DEVTOOL = ((options: VuexDevtoolOptions) => boolean) | boolean
export type VuexDevtoolOptions = { type: 'mutation' | 'action'; paths: string; payload: any }

const log = ({ type, paths, payload }: VuexDevtoolOptions) => {
  if (!__IS_SERVER__ && !__PRODUCTION__) {
    const devtool = getHostGlobal().VUEX_DEVTOOL
    if (devtool) {
      if (devtool instanceof Function) {
        if (devtool({ type, paths, payload })) {
          console.log(`[VUEX_DEVTOOL] ${type.toUpperCase()} ${paths}`, payload)
        }
      } else {
        console.log(`[VUEX_DEVTOOL] ${type.toUpperCase()} ${paths}`, payload)
      }
    }
  }
}

type FixActionContext<S, RS, G, RG> = {
  dispatch: Dispatch
  commit: Commit
  state: S
  rootState: RS
  getters: G
  rootGetters: RG
}

function isEmpty(list: any) {
  return !(list && list.length)
}

function isStore(context: any) {
  return 'strict' in context
}

function checkNamespace(namespace: string[], args: any[]) {
  if (namespace) {
    if (typeof namespace === 'string') {
      args.unshift(namespace)
    } else {
      namespace = [...namespace]
      namespace.reverse().forEach(key => {
        args.unshift(key)
      })
    }
  }
}

function checkStore(context: any, { namespace, args }: any) {
  if (isStore(context)) {
    checkNamespace(namespace, args)
  }
}

/**
 * 当此模块为 namespaced 的时候, `$store.commit(mutation)` 和在 action handler 内的 `ctx.commit(mutation)` 是不一样的
 */
export function makeMutator<Context extends FixActionContext<any, any, any, any>, MutationPayloadTree>(ns?: string) {
  return <K extends keyof MutationPayloadTree>(
    context: Store<any> | Context,
    mutation: K,
    payload: MutationPayloadTree[K]
  ) => {
    let mutationName = mutation as string
    if (ns && isStore(context)) {
      mutationName = `${ns}/${mutation}`
    }
    return context.commit(mutationName, payload)
  }
}

export function hasModule(store: Store<any>, namespace: string) {
  const modules = (store as any)._modules
  return !!modules.root.getChild(namespace)
}

/**
 * Vuex 注册的生命周期
 */
type ModuleRegisterationStage = 'client-onReady' | 'client-beforeRouteUpdate'

type RegistrationCallback<T extends { beforeRouteUpdate: boolean } = any> = (opts: T) => PromiseLike<any>

export type RegistrationConfig = {
  namespace: string
  stage?: ModuleRegisterationStage
  module: Module<any, any>
  callback?: RegistrationCallback
  updateCallback?: RegistrationCallback
  preserveState?: boolean
}

export async function registerModules(configList: RegistrationConfig[], options: any) {
  if (isEmpty(configList) || !options) return
  const store = options.store
  if (!store) return
  const beforeRouteUpdate = options.stage === 'client-beforeRouteUpdate'
  const bluebirdList: any = []
  configList.forEach(item => {
    const { namespace, module, updateCallback, callback, preserveState } = item
    const hasState = namespace in store.state
    if (!hasModule(store, namespace)) {
      store.registerModule(namespace, module, { preserveState: hasState })
    }
    const isUpdateCallback = hasState && beforeRouteUpdate && updateCallback
    const callbackFn = isUpdateCallback ? updateCallback : callback
    if (callbackFn) {
      if (isUpdateCallback || preserveState || !hasState) {
        bluebirdList.push(callbackFn(Object.assign({ beforeRouteUpdate }, options)))
      }
    }
  })

  await Promise.all(bluebirdList)
}

export function unregisterModule(store: Store<any>, namespace: string) {
  if (hasModule(store, namespace)) {
    store.unregisterModule(namespace)
  }
}

export function unregisterModules(store: Store<any>, configList: RegistrationConfig[]) {
  configList.forEach(item => {
    unregisterModule(store, item.namespace)
  })
}

export type SniffMutationPayload<T> = T extends (state: any, payload: infer P) => any ? P : T
export type SniffMutationPayloadTree<S, M extends MutationTree<S>> = { [K in keyof M]: SniffMutationPayload<M[K]> }
export type SniffActionPayload<T> = T extends (state: any, payload: infer P) => infer V
  ? { payload: P; value: V }
  : { payload: unknown; value: unknown }

export class VuexStoreHelper<GlobalStates, GlobalGetters> {
  /**
   * 向 客户端 注入 vuex 服务器端 初始化的数据
   *  - When app has finished rendering
   *  - After the app is rendered, our store is now filled with the state from our components.
   *  - When we attach the state to the context, and the `template` option
   *    is used for the renderer, the state will automatically be
   *    serialized and injected into the HTML as `window.__INITIAL_STATE__`.
   */
  static injectStoreState(context: any, store: Store<any>) {
    const getContextRendered = (rendered?: Function) => {
      return (...args: any[]) => {
        if (rendered) rendered.call(this, args)
        context.state = store.state
      }
    }
    if (context.rendered && context.rendered instanceof Function) {
      const rendered = context.rendered
      context.rendered = getContextRendered(rendered)
    } else {
      context.rendered = getContextRendered()
    }
  }

  makeWrapper<T = GlobalStates, G = GlobalGetters>(namespace: keyof GlobalStates | string[] = '' as any) {
    /* ActionTree Fix Start  */
    type ActionObject<S, R> = {
      root?: boolean
      handler: ActionHandler<S, R>
    }
    type ActionHandler<S, R> = (
      this: Store<R>,
      injectee: FixActionContext<S, R, G, GlobalGetters>,
      payload?: any
    ) => any
    type Action<S, R> = ActionHandler<S, R> | ActionObject<S, R>
    type ActionTree<S, R> = {
      [key: string]: Action<S, R>
    }
    /* ActionTree Fix end  */
    type SniffActionPayloadTree<S, M extends ActionTree<S, GlobalStates>> = { [K in keyof M]: SniffActionPayload<M[K]> }
    type SniffActionPayloadPathTree<S, M extends ActionTree<S, GlobalStates>> = {
      [K in keyof M]: SniffMutationPayload<M[K]>
    }
    type TActionContext = Store<any> | FixActionContext<T, GlobalStates, G, GlobalGetters>
    type GetterTree<LG> = {
      [K in keyof LG]: (state: T, getters: LG, rootState: GlobalStates, rootGetters: GlobalGetters) => LG[K]
    }
    type TActionTree = ActionTree<T, GlobalStates>

    function createGetState() {
      function getState<P extends keyof T>(context: TActionContext, path: P): T[P]
      function getState<P extends keyof T, P1 extends keyof T[P]>(context: TActionContext, path: P, path1: P1): T[P][P1]
      function getState<P extends keyof T, P1 extends keyof T[P], P2 extends keyof T[P][P1]>(
        context: TActionContext,
        path: P,
        path1: P1,
        path2: P2
      ): T[P][P1][P2]
      function getState<
        P extends keyof T,
        P1 extends keyof T[P],
        P2 extends keyof T[P][P1],
        P3 extends keyof T[P][P1][P2]
      >(context: TActionContext, path: P, path1: P1, path2: P2, path3: P3): T[P][P1][P2][P3]
      function getState(context: TActionContext, ...args: string[]) {
        checkStore(context, { namespace, args })
        let result
        for (let index = 0; index < args.length; index++) {
          const key = args[index]
          if (typeof result === 'undefined') result = context.state[key]
          else result = result[key]
          if (typeof result === 'undefined') return
        }
        return result
      }
      return getState
    }

    function createGetGetter() {
      function getGetter<P extends keyof G>(context: TActionContext, path: P): G[P]
      function getGetter<P extends keyof G, P1 extends keyof G[P]>(
        context: TActionContext,
        path: P,
        path1: P1
      ): G[P][P1]
      function getGetter<P extends keyof G, P1 extends keyof G[P], P2 extends keyof G[P][P1]>(
        context: TActionContext,
        path: P,
        path1: P1,
        path2: P2
      ): G[P][P1][P2]
      function getGetter<
        P extends keyof G,
        P1 extends keyof G[P],
        P2 extends keyof G[P][P1],
        P3 extends keyof G[P][P1][P2]
      >(context: TActionContext, path: P, path1: P1, path2: P2, path3: P3): G[P][P1][P2][P3]
      function getGetter(context: TActionContext, ...args: string[]) {
        checkStore(context, { namespace, args })
        const paths = args.join('/')
        return context.getters[paths]
      }
      return getGetter
    }

    function makeGetters<LG = G>(getters: GetterTree<LG>) {
      return getters
    }

    function makeMutations<M extends MutationTree<T>>(mutationTree: M) {
      return mutationTree
    }

    function createCommit<Mutation extends MutationTree<T>>() {
      type MutationPayloadTree = SniffMutationPayloadTree<T, Mutation>
      function commit<M extends keyof MutationPayloadTree>(
        context: TActionContext,
        mutation: M,
        payload: MutationPayloadTree[M]
      ): void
      function commit<P extends keyof MutationPayloadTree, M extends keyof MutationPayloadTree[P]>(
        context: TActionContext,
        path: P,
        mutation: M,
        payload: SniffMutationPayloadTree<T, MutationPayloadTree[P]>[M]
      ): void
      function commit<
        P extends keyof MutationPayloadTree,
        P1 extends keyof MutationPayloadTree[P],
        M extends keyof MutationPayloadTree[P][P1]
      >(
        context: TActionContext,
        path: P,
        path1: P1,
        mutation: M,
        payload: SniffMutationPayloadTree<T, MutationPayloadTree[P][P1]>[M]
      ): void
      function commit<
        P extends keyof MutationPayloadTree,
        P1 extends keyof MutationPayloadTree[P],
        P2 extends keyof MutationPayloadTree[P][P1],
        M extends keyof MutationPayloadTree[P][P1][P2]
      >(
        context: TActionContext,
        path: P,
        path1: P1,
        path2: P2,
        mutation: M,
        payload: SniffMutationPayloadTree<T, MutationPayloadTree[P][P1][P2]>[M]
      ): void
      function commit(context: TActionContext, ...args: any[]) {
        checkStore(context, { namespace, args })
        if (args.length < 2) {
          console.error('commit args.length must > 2')
          return
        }
        const payload = args.pop()
        const paths = args.join('/')
        log({ type: 'mutation', paths, payload })
        return context.commit(paths, payload)
      }

      return commit
    }

    function makeActions<A extends TActionTree>(actionTree: A) {
      return actionTree
    }

    function createDispatch<AT extends TActionTree>() {
      type ActionPayloadPathTree = SniffActionPayloadPathTree<T, AT>
      type ActionPayloadTree = SniffActionPayloadTree<T, AT>
      function dispatch<M extends keyof ActionPayloadTree>(
        context: TActionContext,
        type: M,
        payload: ActionPayloadTree[M]['payload']
      ): ActionPayloadTree[M]['value']
      function dispatch<P extends keyof ActionPayloadPathTree, M extends keyof ActionPayloadPathTree[P]>(
        context: TActionContext,
        path: P,
        type: M,
        payload: SniffActionPayloadTree<ActionPayloadPathTree[P], AT>[M]['payload']
      ): SniffActionPayloadTree<ActionPayloadPathTree[P], AT>[M]['value']
      function dispatch<
        P extends keyof ActionPayloadPathTree,
        P1 extends keyof ActionPayloadPathTree[P],
        M extends keyof ActionPayloadPathTree[P][P1]
      >(
        context: TActionContext,
        path: P,
        path1: P1,
        type: M,
        payload: SniffActionPayloadTree<ActionPayloadPathTree[P], AT>[M]['payload']
      ): SniffActionPayloadTree<ActionPayloadPathTree[P], AT>[M]['value']
      function dispatch<
        P extends keyof ActionPayloadPathTree,
        P1 extends keyof ActionPayloadPathTree[P],
        P2 extends keyof ActionPayloadPathTree[P][P1],
        M extends keyof ActionPayloadPathTree[P][P1][P2]
      >(
        context: TActionContext,
        path: P,
        path1: P1,
        path2: P2,
        type: M,
        payload: SniffActionPayloadTree<ActionPayloadPathTree[P], AT>[M]['payload']
      ): SniffActionPayloadTree<ActionPayloadPathTree[P], AT>[M]['value']
      function dispatch(context: TActionContext, ...args: any[]): any {
        checkStore(context, { namespace, args })
        if (args.length < 2) {
          console.error('commit args.length must > 2')
          return
        }
        const payload = args.pop()
        const paths = args.join('/')
        log({ type: 'action', paths, payload })
        return context.dispatch(paths, payload)
      }

      return dispatch
    }

    return {
      createGetState,
      createGetGetter,
      makeGetters,
      makeMutations,
      createCommit,
      makeActions,
      createDispatch
    }
  }
}
