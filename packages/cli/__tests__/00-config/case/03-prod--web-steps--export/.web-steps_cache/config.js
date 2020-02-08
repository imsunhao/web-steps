module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
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
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("clean-webpack-plugin");

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./packages/cli/__tests__/01-compiler/case/04-prod-we-steps--router-vuex/config/webpack-base.ts
const getConfig = function ({ resolve }) {
    return {
        optimization: {
            minimize: false
        },
        output: {
            path: resolve('./output'),
            publicPath: '/output/'
        }
    };
};
/* harmony default export */ var webpack_base = (getConfig);

// EXTERNAL MODULE: external "clean-webpack-plugin"
var external_clean_webpack_plugin_ = __webpack_require__(0);

// CONCATENATED MODULE: ./packages/cli/__tests__/01-compiler/case/04-prod-we-steps--router-vuex/config/webpack-client.ts

const webpack_client_getConfig = function ({ resolve }) {
    return {
        entry: {
            client: resolve('./src/entry-client.ts')
        },
        externals: { vue: 'Vue', 'vue-router': 'VueRouter', vuex: 'Vuex' },
        plugins: [new external_clean_webpack_plugin_["CleanWebpackPlugin"]()]
    };
};
/* harmony default export */ var webpack_client = (webpack_client_getConfig);

// CONCATENATED MODULE: ./packages/cli/__tests__/01-compiler/case/04-prod-we-steps--router-vuex/config/webpack-server.ts
const webpack_server_getConfig = function ({ resolve }) {
    return {
        entry: {
            server: resolve('./src/entry-server.ts')
        }
    };
};
/* harmony default export */ var webpack_server = (webpack_server_getConfig);

// CONCATENATED MODULE: ./packages/cli/__tests__/01-compiler/case/04-prod-we-steps--router-vuex/web-steps.ts



const web_steps_getConfig = function ({ resolve }) {
    return {
        src: {
            SSR: {
                base: { webpack: webpack_base },
                client: { webpack: webpack_client },
                server: {
                    webpack: webpack_server,
                    render: {
                        templatePath: resolve('index.template.html')
                    }
                }
            }
        }
    };
};
/* harmony default export */ var web_steps = __webpack_exports__["default"] = (web_steps_getConfig);


/***/ })
/******/ ]);