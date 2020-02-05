/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	function webpackJsonpCallback(data) {
/******/ 		var chunkIds = data[0];
/******/ 		var moreModules = data[1];
/******/
/******/
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, resolves = [];
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(Object.prototype.hasOwnProperty.call(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 				resolves.push(installedChunks[chunkId][0]);
/******/ 			}
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(data);
/******/
/******/ 		while(resolves.length) {
/******/ 			resolves.shift()();
/******/ 		}
/******/
/******/ 	};
/******/
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded and loading chunks
/******/ 	// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 	// Promise = chunk loading, 0 = chunk loaded
/******/ 	var installedChunks = {
/******/ 		0: 0
/******/ 	};
/******/
/******/
/******/
/******/ 	// script path function
/******/ 	function jsonpScriptSrc(chunkId) {
/******/ 		return __webpack_require__.p + "" + ({}[chunkId]||chunkId) + "." + {"1":"f81c55a97397f020e38f"}[chunkId] + ".js"
/******/ 	}
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/ 	// This file contains only the entry chunk.
/******/ 	// The chunk loading function for additional chunks
/******/ 	__webpack_require__.e = function requireEnsure(chunkId) {
/******/ 		var promises = [];
/******/
/******/
/******/ 		// JSONP chunk loading for javascript
/******/
/******/ 		var installedChunkData = installedChunks[chunkId];
/******/ 		if(installedChunkData !== 0) { // 0 means "already installed".
/******/
/******/ 			// a Promise means "currently loading".
/******/ 			if(installedChunkData) {
/******/ 				promises.push(installedChunkData[2]);
/******/ 			} else {
/******/ 				// setup Promise in chunk cache
/******/ 				var promise = new Promise(function(resolve, reject) {
/******/ 					installedChunkData = installedChunks[chunkId] = [resolve, reject];
/******/ 				});
/******/ 				promises.push(installedChunkData[2] = promise);
/******/
/******/ 				// start chunk loading
/******/ 				var script = document.createElement('script');
/******/ 				var onScriptComplete;
/******/
/******/ 				script.charset = 'utf-8';
/******/ 				script.timeout = 120;
/******/ 				if (__webpack_require__.nc) {
/******/ 					script.setAttribute("nonce", __webpack_require__.nc);
/******/ 				}
/******/ 				script.src = jsonpScriptSrc(chunkId);
/******/
/******/ 				// create error before stack unwound to get useful stacktrace later
/******/ 				var error = new Error();
/******/ 				onScriptComplete = function (event) {
/******/ 					// avoid mem leaks in IE.
/******/ 					script.onerror = script.onload = null;
/******/ 					clearTimeout(timeout);
/******/ 					var chunk = installedChunks[chunkId];
/******/ 					if(chunk !== 0) {
/******/ 						if(chunk) {
/******/ 							var errorType = event && (event.type === 'load' ? 'missing' : event.type);
/******/ 							var realSrc = event && event.target && event.target.src;
/******/ 							error.message = 'Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
/******/ 							error.name = 'ChunkLoadError';
/******/ 							error.type = errorType;
/******/ 							error.request = realSrc;
/******/ 							chunk[1](error);
/******/ 						}
/******/ 						installedChunks[chunkId] = undefined;
/******/ 					}
/******/ 				};
/******/ 				var timeout = setTimeout(function(){
/******/ 					onScriptComplete({ type: 'timeout', target: script });
/******/ 				}, 120000);
/******/ 				script.onerror = script.onload = onScriptComplete;
/******/ 				document.head.appendChild(script);
/******/ 			}
/******/ 		}
/******/ 		return Promise.all(promises);
/******/ 	};
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/output/";
/******/
/******/ 	// on error function for async loading
/******/ 	__webpack_require__.oe = function(err) { console.error(err); throw err; };
/******/
/******/ 	var jsonpArray = window["webpackJsonp"] = window["webpackJsonp"] || [];
/******/ 	var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
/******/ 	jsonpArray.push = webpackJsonpCallback;
/******/ 	jsonpArray = jsonpArray.slice();
/******/ 	for(var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
/******/ 	var parentJsonpFunction = oldJsonpFunction;
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 8);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = Vue;

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = Vuex;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = VueRouter;

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return normalizeComponent; });
/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

function normalizeComponent (
  scriptExports,
  render,
  staticRenderFns,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier, /* server only */
  shadowMode /* vue-cli only */
) {
  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (render) {
    options.render = render
    options.staticRenderFns = staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = 'data-v-' + scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = shadowMode
      ? function () { injectStyles.call(this, this.$root.$options.shadowRoot) }
      : injectStyles
  }

  if (hook) {
    if (options.functional) {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functioal component in vue file
      var originalRender = options.render
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return originalRender(h, context)
      }
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    }
  }

  return {
    exports: scriptExports,
    options: options
  }
}


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXTERNAL MODULE: external "Vue"
var external_Vue_ = __webpack_require__(0);
var external_Vue_default = /*#__PURE__*/__webpack_require__.n(external_Vue_);

// EXTERNAL MODULE: external "Vuex"
var external_Vuex_ = __webpack_require__(1);
var external_Vuex_default = /*#__PURE__*/__webpack_require__.n(external_Vuex_);

// EXTERNAL MODULE: /Users/sunhao/Documents/imsunhao/utils/packages/helper/index.js
var helper = __webpack_require__(5);

// CONCATENATED MODULE: ./src/store/helpers.ts

const { makeWrapper } = new helper["VuexStoreHelper"]();
const globalHelper = makeWrapper();

// CONCATENATED MODULE: ./src/store/actions.ts


const actions = globalHelper.makeActions({
    /**
     * 获取 project-detail 数据，然后初始化所有相应 state 数据
     */
    FETCH_USER(ctx, payload) {
        commit(ctx, 'SET_USER', payload);
    }
});
/* harmony default export */ var store_actions = (actions);
const dispatch = globalHelper.createDispatch();

// CONCATENATED MODULE: ./src/store/mutations.ts

const mutations = globalHelper.makeMutations({
    SET_USER: (state, user) => {
        state.user = user;
    }
});
/* harmony default export */ var store_mutations = (mutations);
const commit = globalHelper.createCommit();
const getState = globalHelper.createGetState();

// CONCATENATED MODULE: ./src/store/getters.ts

const getters = globalHelper.makeGetters({
    hasUser(state) {
        // console.log('hasUser', state, state.user)
        return !!state.user;
    }
});
/* harmony default export */ var store_getters = (getters);
const getGetter = globalHelper.createGetGetter();

// CONCATENATED MODULE: ./src/store/index.ts
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return createStore; });
/* concated harmony reexport commit */__webpack_require__.d(__webpack_exports__, "a", function() { return commit; });
/* concated harmony reexport getState */__webpack_require__.d(__webpack_exports__, "e", function() { return getState; });
/* concated harmony reexport dispatch */__webpack_require__.d(__webpack_exports__, "c", function() { return dispatch; });
/* concated harmony reexport getGetter */__webpack_require__.d(__webpack_exports__, "d", function() { return getGetter; });





function state() {
    return {
        user: {
            test: ''
        }
    };
}
external_Vue_default.a.use(external_Vuex_default.a);
function createStore() {
    return new external_Vuex_default.a.Store({
        state: state(),
        actions: store_actions,
        mutations: store_mutations,
        getters: store_getters
    });
}



/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(7)


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__.p = '/output/'


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, '__esModule', { value: true });

class RouterHelper {
    static getHookFromComponent(compo, name) {
        return (compo[name] ||
            (compo.$options && compo.$options[name]) ||
            (compo.options && compo.options[name]) ||
            (compo.constructor && compo.constructor[name]) ||
            (compo.super && compo.super[name]));
    }
    static async callComponentsHook(router, hookName, context) {
        const matchedComponents = router.getMatchedComponents();
        if (!matchedComponents.length)
            return;
        for (let i = 0; i < matchedComponents.length; i++) {
            const component = matchedComponents[i];
            const hook = RouterHelper.getHookFromComponent(component, hookName);
            if (hook) {
                if (hook.then && typeof hook.then === 'function') {
                    await hook(context);
                }
                else if (typeof hook === 'function') {
                    hook(context);
                }
            }
        }
    }
}
class RouterReadyHelper {
    /**
     * 调用 vue 中 asyncData 函数
     */
    static async asyncData(router, context) {
        const HOOK_NAME = 'asyncData';
        await RouterHelper.callComponentsHook(router, HOOK_NAME, context);
    }
}

let log = ({ type, paths, payload }) => {
    if (false) {}
};
function isEmpty(list) {
    return !(list && list.length);
}
/**
 * 当此模块为 namespaced 的时候, `$store.commit(mutation)` 和在 action handler 内的 `ctx.commit(mutation)` 是不一样的
 */
function makeMutator(ns) {
    return (context, mutation, payload) => {
        let mutationName = mutation;
        if (ns && isStore(context)) {
            mutationName = `${ns}/${mutation}`;
        }
        return context.commit(mutationName, payload);
    };
}
function hasModule(store, namespace) {
    const modules = store._modules;
    return !!modules.root.getChild(namespace);
}
async function registerModules(configList, options) {
    if (isEmpty(configList) || !options)
        return;
    const store = options.store;
    if (!store)
        return;
    const beforeRouteUpdate = options.stage === 'client-beforeRouteUpdate';
    const bluebirdList = [];
    configList.forEach(item => {
        const { namespace, module, updateCallback, callback, preserveState } = item;
        const hasState = namespace in store.state;
        if (!hasModule(store, namespace)) {
            store.registerModule(namespace, module, { preserveState: hasState });
        }
        const isUpdateCallback = hasState && beforeRouteUpdate && updateCallback;
        const callbackFn = isUpdateCallback ? updateCallback : callback;
        if (callbackFn) {
            if (isUpdateCallback || preserveState || !hasState) {
                bluebirdList.push(callbackFn(Object.assign({ beforeRouteUpdate }, options)));
            }
        }
    });
    await Promise.all(bluebirdList);
}
function unregisterModule(store, namespace) {
    if (hasModule(store, namespace)) {
        store.unregisterModule(namespace);
    }
}
function unregisterModules(store, configList) {
    configList.forEach(item => {
        unregisterModule(store, item.namespace);
    });
}
function isStore(context) {
    return 'strict' in context;
}
function checkStore(context, { namespace, args }) {
    if (isStore(context)) {
        checkNamespace(namespace, args);
    }
}
function checkNamespace(namespace, args) {
    if (namespace) {
        if (typeof namespace === 'string') {
            args.unshift(namespace);
        }
        else {
            namespace = [...namespace];
            namespace.reverse().forEach(key => {
                args.unshift(key);
            });
        }
    }
}
class VuexStoreHelper {
    /**
     * 向 客户端 注入 vuex 服务器端 初始化的数据
     *  - When app has finished rendering
     *  - After the app is rendered, our store is now filled with the state from our components.
     *  - When we attach the state to the context, and the `template` option
     *    is used for the renderer, the state will automatically be
     *    serialized and injected into the HTML as `window.__INITIAL_STATE__`.
     */
    static injectStoreState(context, store) {
        const getContextRendered = (rendered) => {
            return (...args) => {
                if (rendered)
                    rendered.call(this, args);
                context.state = store.state;
            };
        };
        if (context.rendered && context.rendered instanceof Function) {
            const rendered = context.rendered;
            context.rendered = getContextRendered(rendered);
        }
        else {
            context.rendered = getContextRendered();
        }
    }
    makeWrapper(namespace = '') {
        function createGetState() {
            function getState(context, ...args) {
                checkStore(context, { namespace, args });
                let result;
                for (let index = 0; index < args.length; index++) {
                    const key = args[index];
                    if (!result)
                        result = context.state[key];
                    else
                        result = result[key];
                    if (!result)
                        return;
                }
                return result;
            }
            return getState;
        }
        function createGetGetter() {
            function getGetter(context, ...args) {
                checkStore(context, { namespace, args });
                const paths = args.join('/');
                return context.getters[paths];
            }
            return getGetter;
        }
        function makeGetters(getters) {
            return getters;
        }
        function makeMutations(mutationTree) {
            return mutationTree;
        }
        function createCommit() {
            function commit(context, ...args) {
                checkStore(context, { namespace, args });
                if (args.length < 2) {
                    console.error('commit args.length must > 2');
                    return;
                }
                const payload = args.pop();
                const paths = args.join('/');
                log({ type: 'mutation', paths, payload });
                return context.commit(paths, payload);
            }
            return commit;
        }
        function makeActions(actionTree) {
            return actionTree;
        }
        function createDispatch() {
            function dispatch(context, ...args) {
                checkStore(context, { namespace, args });
                if (args.length < 2) {
                    console.error('commit args.length must > 2');
                    return;
                }
                const payload = args.pop();
                const paths = args.join('/');
                log({ type: 'action', paths, payload });
                return context.dispatch(paths, payload);
            }
            return dispatch;
        }
        return {
            createGetState,
            createGetGetter,
            makeGetters,
            makeMutations,
            createCommit,
            makeActions,
            createDispatch
        };
    }
}

exports.RouterReadyHelper = RouterReadyHelper;
exports.VuexStoreHelper = VuexStoreHelper;
exports.hasModule = hasModule;
exports.makeMutator = makeMutator;
exports.registerModules = registerModules;
exports.unregisterModule = unregisterModule;
exports.unregisterModules = unregisterModules;


/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: ./src/public-path-setup.js
var public_path_setup = __webpack_require__(6);

// EXTERNAL MODULE: external "Vue"
var external_Vue_ = __webpack_require__(0);
var external_Vue_default = /*#__PURE__*/__webpack_require__.n(external_Vue_);

// CONCATENATED MODULE: /Users/sunhao/Documents/imsunhao/utils/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/sunhao/Documents/imsunhao/utils/node_modules/vue-loader/lib??vue-loader-options!./src/App.vue?vue&type=template&id=7ba5bd90&
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { attrs: { id: "app" } },
    [
      _c(
        "transition",
        { attrs: { name: "fade", mode: "out-in" } },
        [_c("router-view", { staticClass: "view" })],
        1
      )
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true


// CONCATENATED MODULE: ./src/App.vue?vue&type=template&id=7ba5bd90&

// CONCATENATED MODULE: /Users/sunhao/Documents/imsunhao/utils/node_modules/vue-loader/lib??vue-loader-options!./src/App.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//

/* harmony default export */ var Appvue_type_script_lang_js_ = ({
  name: 'App'
});

// CONCATENATED MODULE: ./src/App.vue?vue&type=script&lang=js&
 /* harmony default export */ var src_Appvue_type_script_lang_js_ = (Appvue_type_script_lang_js_); 
// EXTERNAL MODULE: /Users/sunhao/Documents/imsunhao/utils/node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(3);

// CONCATENATED MODULE: ./src/App.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  src_Appvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/App.vue"
/* harmony default export */ var App = (component.exports);
// EXTERNAL MODULE: ./src/store/index.ts + 4 modules
var src_store = __webpack_require__(4);

// EXTERNAL MODULE: external "VueRouter"
var external_VueRouter_ = __webpack_require__(2);
var external_VueRouter_default = /*#__PURE__*/__webpack_require__.n(external_VueRouter_);

// CONCATENATED MODULE: ./src/router/index.ts


external_Vue_default.a.use(external_VueRouter_default.a);
// Home Page
const HomePage = () => __webpack_require__.e(/* import() */ 1).then(__webpack_require__.bind(null, 9));
function createRouter() {
    return new external_VueRouter_default.a({
        mode: 'history',
        routes: [
            {
                path: '/',
                name: 'home',
                component: HomePage
            }
        ]
    });
}

// CONCATENATED MODULE: ./src/app.ts




/**
 * 生成 vm app
 */
function createApp() {
    const router = createRouter();
    const store = Object(src_store["b" /* createStore */])();
    const app = new external_Vue_default.a({
        store,
        router,
        render: h => h(App)
    });
    return { app, router, store };
}

// CONCATENATED MODULE: ./src/entry-client.ts

const __HOST_GLOBAL__ = window;

const { app: entry_client_app, router: entry_client_router, store: entry_client_store } = createApp();
// prime the store with server-initialized state.
// the state is determined during SSR and inlined in the page markup.
if (__HOST_GLOBAL__.__INITIAL_STATE__) {
    entry_client_store.replaceState(__HOST_GLOBAL__.__INITIAL_STATE__);
}
__HOST_GLOBAL__.store = entry_client_store;
entry_client_router.onReady(() => {
    entry_client_app.$mount('#app');
});


/***/ })
/******/ ]);