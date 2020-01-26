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
/******/ 	return __webpack_require__(__webpack_require__.s = "./build.config.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./build.config.ts":
/*!*************************!*\
  !*** ./build.config.ts ***!
  \*************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./config */ "./config/index.js");
/* harmony import */ var _build_webpack_base_conf_babel__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./build/webpack.base.conf.babel */ "./build/webpack.base.conf.babel.js");
/* harmony import */ var _build_webpack_dll_conf_babel__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./build/webpack.dll.conf.babel */ "./build/webpack.dll.conf.babel.js");
/* harmony import */ var _build_webpack_client_conf_babel__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./build/webpack.client.conf.babel */ "./build/webpack.client.conf.babel.js");
/* harmony import */ var _build_webpack_server_conf_babel__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./build/webpack.server.conf.babel */ "./build/webpack.server.conf.babel.js");
/* harmony import */ var _build_webpack_svg_conf_babel__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./build/webpack.svg.conf.babel */ "./build/webpack.svg.conf.babel.js");
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! path */ "path");
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_6__);







/* harmony default export */ __webpack_exports__["default"] = (function (inject) {
  const config = Object(_config__WEBPACK_IMPORTED_MODULE_0__["getConfig"])(inject);
  const base = Object(_build_webpack_base_conf_babel__WEBPACK_IMPORTED_MODULE_1__["default"])(config, inject);
  const dll = Object(_build_webpack_dll_conf_babel__WEBPACK_IMPORTED_MODULE_2__["default"])(config, inject);
  const client = Object(_build_webpack_client_conf_babel__WEBPACK_IMPORTED_MODULE_3__["default"])(config, inject);
  const server = Object(_build_webpack_server_conf_babel__WEBPACK_IMPORTED_MODULE_4__["default"])(config, inject);
  const svg = Object(_build_webpack_svg_conf_babel__WEBPACK_IMPORTED_MODULE_5__["default"])(config, inject);
  return {
    env: ['SERVER_ENV', 'ENV', 'NODE_ENV'],
    babelrc: {
      presets: [['@babel/preset-env', {
        modules: false,
        targets: {
          browsers: ['IE >= 11', 'last 2 versions']
        },
        useBuiltIns: 'usage',
        corejs: {
          version: 3
        }
      }]]
    },
    render: config.render,
    statics: config.statics,
    proxyTable: config.proxyTable,
    sass: {// data: require('!!raw-loader!./src/styles/variables.scss').default,
    },
    extensions: {
      entry: {
        extensions: inject.resolve('./server/index.js')
      },
      path: path__WEBPACK_IMPORTED_MODULE_6___default.a.resolve(base.output.path)
    },
    exclude: {
      client: [],
      server: ['normalize.css', 'src/styles/_element-ui/dist/common.css', '@bestminr/ui-blazing/dist/common.css', '@bestminr/bling-lib', '@bestminr/control-flow', '@bestminr/idb', // '@bestminr/image-utils',
      // '@bestminr/selectable',
      'idb', 'bmp-js', 'mousetrap', 'wavesurfer.js', '@bestminr/exif', 'wow.js', 'regl']
    },
    webpack: {
      dll,
      base,
      client,
      server
    },
    customBuild: {
      svg
    },
    plugins: {
      'build-style': {
        entry: inject.resolve('./src/styles/variables.scss'),
        output: inject.resolve('./src/styles/_element-ui/dist')
      }
    }
  };
});

/***/ }),

/***/ "./build/webpack.base.conf.babel.js":
/*!******************************************!*\
  !*** ./build/webpack.base.conf.babel.js ***!
  \******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (function (config, {
  resolve
}) {
  const isProduction = config.isProd;
  const commonAssetsUrlPrefix = config.COMMON_ASSETS_URL_PREFIX || '';
  const alias = isProduction ? {
    store$: resolve('src/store/index.ts')
  } : {
    store$: resolve('src/store/index-dev.ts')
  };
  return {
    output: {
      path: config.assetRoot,
      publicPath: config.outputPath
    },
    resolve: {
      alias: {
        vue: resolve('node_modules/vue'),
        public: resolve('public'),
        src: resolve('src'),
        stories: resolve('stories'),
        components: resolve('src/components'),
        '@bestminr/draggable': resolve('node_modules/@bestminr/draggable/lib/es5/draggable.bundle.js'),
        'wavesurfer.js': resolve('node_modules/wavesurfer.js/dist/wavesurfer.js'),
        ...alias
      }
    },
    // optimization: {
    //   splitChunks: {
    //     cacheGroups: {
    //       local_modules: {
    //         test: /[\\/]local_modules[\\/]/,
    //         name: 'local_modules',
    //         chunks: 'initial',
    //         priority: 2,
    //         minChunks: 2,
    //       },
    //     },
    //   },
    // },
    module: {
      rules: [{
        test: /\.(woff2?|eot|ttf|otf)/,
        loader: 'file-loader',
        options: {
          limit: 10000,
          outputPath: isProduction ? '../../common-assets/font/' : undefined,
          publicPath: isProduction ? `${commonAssetsUrlPrefix}/font/` : undefined
        }
      }, {
        test: /worker\.js$/,
        loader: 'worker-loader',
        options: {
          inline: true
        }
      }, {
        test: /.*\.wasm$/,
        // This is needed to make webpack NOT process wasm files.
        // See https://github.com/webpack/webpack/issues/6725
        type: 'javascript/auto',
        loader: 'file-loader',
        options: {
          name: '[name].[hash:5].[ext]'
        }
      }]
    }
  };
});

/***/ }),

/***/ "./build/webpack.client.conf.babel.js":
/*!********************************************!*\
  !*** ./build/webpack.client.conf.babel.js ***!
  \********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (function (config, {
  resolve
}) {
  const isProduction = config.isProd;

  const {
    InjectManifest
  } = __webpack_require__(/*! workbox-webpack-plugin */ "workbox-webpack-plugin");

  const swDest = resolve(`${config.assetRoot}/sw.js`);
  return {
    entry: {
      app: ['./src/entry-client.ts']
    },
    output: {
      filename: '[name].[chunkhash].js',
      globalObject: 'this'
    },
    module: {
      rules: [{
        test: /\.svg$/,
        loader: 'null-loader',
        include: [resolve('./public/icon')]
      }]
    },
    plugins: isProduction ? [new InjectManifest({
      swSrc: resolve('src/service-worker/sw.ts'),
      include: ['dist/build/**/*.{css,wasm}'],
      swDest
    })] : []
  };
});

/***/ }),

/***/ "./build/webpack.dll.conf.babel.js":
/*!*****************************************!*\
  !*** ./build/webpack.dll.conf.babel.js ***!
  \*****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (function (config, {
  resolve
}) {
  const path = resolve(`${config.assetRoot}/dll`);
  return {
    entry: {
      lib: ['axios', 'lodash', 'bluebird', 'rxjs'],
      vue_lib: ['vue', 'vue-router', 'vuex', 'vuex-router-sync', '@bestminr/ui-blazing'] // video_lib: ['video.js'],

    },
    path,
    define: {
      'process.env.NODE_ENV': JSON.stringify("development" || false)
    },
    publicPath: `${config.outputPath}dll`,
    template: resolve('./src/index.template.html'),
    templateOutput: path,
    webpack: {
      resolve: {
        extensions: ['.ts', '.js', '.vue', '.json'],
        alias: {
          vue: resolve('node_modules/vue')
        }
      }
    }
  };
});

/***/ }),

/***/ "./build/webpack.server.conf.babel.js":
/*!********************************************!*\
  !*** ./build/webpack.server.conf.babel.js ***!
  \********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
const entry = process.env.SPRITE ? ['./src/envs.ts'] : ['./src/entry-server.js'];
/* harmony default export */ __webpack_exports__["default"] = (function (config, {
  resolve
}) {
  return {
    entry: entry
  };
});

/***/ }),

/***/ "./build/webpack.svg.conf.babel.js":
/*!*****************************************!*\
  !*** ./build/webpack.svg.conf.babel.js ***!
  \*****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var svg_sprite_loader_plugin__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! svg-sprite-loader/plugin */ "svg-sprite-loader/plugin");
/* harmony import */ var svg_sprite_loader_plugin__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(svg_sprite_loader_plugin__WEBPACK_IMPORTED_MODULE_0__);

/* harmony default export */ __webpack_exports__["default"] = (function (config, {
  resolve
}) {
  return {
    entry: {
      svg: ['src/util/services/svg-sprite.ts']
    },
    output: {
      filename: '[name].js',
      globalObject: 'this'
    },
    module: {
      rules: [{
        test: /\.svg$/,
        include: [resolve('./public/icon')],
        //包括字体图标文件
        use: [{
          loader: 'svg-sprite-loader',
          options: {
            extract: true,
            spriteFilename: '../common-assets/svg-icons.svg' // symbolId: 'icon-[name]' //这个没有生效，生效的是默认的name

          }
        }, {
          loader: '@bestminr/svg-icon-webpack-loader',
          options: {
            remove: [{
              element: ['rect'],
              attribute: {
                width: 'max-width',
                height: 'max-height'
              }
            }, {
              attribute: ['fill', 'class', 'data-name']
            }],
            customViewBox: '23 23 34 34'
          }
        }]
      }]
    },
    plugins: [new svg_sprite_loader_plugin__WEBPACK_IMPORTED_MODULE_0___default.a({
      plainSprite: true
    })]
  };
});

/***/ }),

/***/ "./config/index.js":
/*!*************************!*\
  !*** ./config/index.js ***!
  \*************************/
/*! exports provided: getConfig */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getConfig", function() { return getConfig; });
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! path */ "path");
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_0__);

const STATICS_MAX_AGE = 1000 * 60 * 60 * 24 * 30;

function getProxyTable(inject, config) {
  const {
    SERVER_HOST
  } = inject.injectContext;
  const {
    outputPath
  } = config;
  return {
    '/api': {
      target: SERVER_HOST,
      changeOrigin: true
    },
    '/socket.io': {
      target: SERVER_HOST,
      changeOrigin: true,
      ws: true
    },
    '/sw.js': {
      target: `http://localhost:${PORT}`,
      pathRewrite: {
        '^/sw.js': path__WEBPACK_IMPORTED_MODULE_0___default.a.join(outputPath, 'sw.js')
      }
    }
  };
}

function getStatics(resolve) {
  return {
    '/dist': {
      path: resolve('./dist'),
      maxAge: getStaticsMaxAge({
        cache: true,
        isProd: false
      })
    },
    '/common-assets': {
      path: resolve('./common-assets'),
      maxAge: getStaticsMaxAge({
        cache: true,
        isProd: false
      })
    },
    '/public': {
      path: resolve('./public'),
      maxAge: getStaticsMaxAge({
        cache: true,
        isProd: false
      })
    },
    '/manifest.json': {
      path: resolve('./manifest.json'),
      maxAge: getStaticsMaxAge({
        cache: false,
        isProd: false
      })
    }
  };
}

const PORT = 8040;
/**
 * 获取配置文件
 * @param {*} inject 注入的数据 ConfigOptions.getOptionsInject
 */

function baseConfig(inject) {
  const {
    resolve
  } = inject;
  const BUILD_ASSETROOT = resolve('./dist/build');
  const DEV_ASSETROOT = resolve('./dist');
  const BUILD_TEMPLATE_PATH = resolve('./dist/build/dll/index.template.html');
  const DEV_TEMPLATE_PATH = resolve('./dist/dll/index.template.html');
  const {
    STATIC_HOST
  } = inject.injectContext;
  return {
    // 公用的一些设置
    public: {
      // 目前是 file-loader 用到, 一些 css 里用到的，与 env 无关的静态文件的存放目录
      COMMON_ASSETS_URL_PREFIX: 'https://tomahawk.oss-cn-beijing.aliyuncs.com/common-assets'
    },
    build: {
      env: {
        NODE_ENV: 'production'
      },
      isProd: true,
      port: PORT,
      assetRoot: BUILD_ASSETROOT,
      localOutputPath: '/dist/build/',
      outputPath: `${STATIC_HOST || ''}/dist/build/`,
      statics: getStatics(resolve),
      render: {
        bundle: path__WEBPACK_IMPORTED_MODULE_0___default.a.join(BUILD_ASSETROOT, 'vue-ssr-server-bundle.json'),
        options: {
          templatePath: BUILD_TEMPLATE_PATH,
          clientManifestPath: path__WEBPACK_IMPORTED_MODULE_0___default.a.join(BUILD_ASSETROOT, 'vue-ssr-client-manifest.json'),
          basedir: BUILD_ASSETROOT
        }
      }
    },
    dev: {
      env: {
        NODE_ENV: 'development'
      },
      isProd: false,
      port: PORT,
      assetRoot: DEV_ASSETROOT,
      outputPath: '/dist/',
      statics: getStatics(resolve),
      render: {
        options: {
          basedir: BUILD_ASSETROOT,
          templatePath: DEV_TEMPLATE_PATH
        }
      }
    }
  };
}

function getConfig(inject, opts = {}) {
  const config = baseConfig(inject);
  const {
    resolve
  } = inject;
  let resultConfig; // 是否设置 proxyTable

  let shouldUseProxyMiddleware = false;

  if (false) {} else {
    resultConfig = Object.assign({}, config.public, config.dev, opts);
    shouldUseProxyMiddleware = true;
  }

  if (shouldUseProxyMiddleware) {
    resultConfig.proxyTable = getProxyTable(inject, resultConfig);
  }

  return resultConfig;
}

function getStaticsMaxAge(options) {
  return options.cache && options.isProd ? STATICS_MAX_AGE : 0;
}

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),

/***/ "svg-sprite-loader/plugin":
/*!*******************************************!*\
  !*** external "svg-sprite-loader/plugin" ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("svg-sprite-loader/plugin");

/***/ }),

/***/ "workbox-webpack-plugin":
/*!*****************************************!*\
  !*** external "workbox-webpack-plugin" ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("workbox-webpack-plugin");

/***/ })

/******/ });