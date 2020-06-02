import Router from 'vue-router'

class RouterHelper {
  static getHookFromComponent(compo: any, name: string) {
    if (!compo) return
    return (
      compo[name] ||
      (compo.$options && compo.$options[name]) ||
      (compo.options && compo.options[name]) ||
      (compo.constructor && compo.constructor[name]) ||
      (compo.super && compo.super[name])
    )
  }

  static async callComponentsHook(router: Router, hookName: string, context: any) {
    const matchedComponents = router.getMatchedComponents()
    if (!matchedComponents.length) return

    for (let i = 0; i < matchedComponents.length; i++) {
      const component = matchedComponents[i]
      const hook = RouterHelper.getHookFromComponent(component, hookName)
      if (hook) {
        if (hook.constructor.name === 'AsyncFunction' || (hook.then && typeof hook.then === 'function')) {
          await hook(context)
        } else if (typeof hook === 'function') {
          hook(context)
        }
      }
    }
  }
}

export class RouterReadyHelper {
  /**
   * 调用 vue 中 asyncData 函数
   * - 父亲 -> 孩子 同步
   */
  static async asyncData<TContext = any>(router: Router, context: TContext) {
    const HOOK_NAME = 'asyncData'

    await RouterHelper.callComponentsHook(router, HOOK_NAME, context)
  }
}
