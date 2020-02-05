(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[1],{

/***/ 9:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: /Users/sunhao/Documents/imsunhao/utils/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/sunhao/Documents/imsunhao/utils/node_modules/vue-loader/lib??vue-loader-options!./src/views/index.vue?vue&type=template&id=a83bd3b0&
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", [
    _c("p", { attrs: { id: "test1" } }, [_vm._v(_vm._s(_vm.text1))]),
    _c("p", { attrs: { id: "state" } }, [_vm._v(_vm._s(_vm.stateTest))]),
    _c("p", { attrs: { id: "hasUser" } }, [_vm._v(_vm._s(_vm.hasUser))])
  ])
}
var staticRenderFns = []
render._withStripped = true


// CONCATENATED MODULE: ./src/views/index.vue?vue&type=template&id=a83bd3b0&

// EXTERNAL MODULE: ./src/store/index.ts + 4 modules
var src_store = __webpack_require__(4);

// CONCATENATED MODULE: /Users/sunhao/Documents/imsunhao/utils/node_modules/vue-loader/lib??vue-loader-options!./src/views/index.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//



/* harmony default export */ var viewsvue_type_script_lang_js_ = ({
  async asyncData({ store, locals: { test } }) {
    await Object(src_store["c" /* dispatch */])(store, 'FETCH_USER', { test })
  },
  data() {
    return {
      text1: 'home Page'
    }
  },
  computed: {
    stateTest() {
      return Object(src_store["e" /* getState */])(this.$store, 'user', 'test')
    },
    hasUser() {
      return Object(src_store["d" /* getGetter */])(this.$store, 'hasUser')
    }
  }
});

// CONCATENATED MODULE: ./src/views/index.vue?vue&type=script&lang=js&
 /* harmony default export */ var src_viewsvue_type_script_lang_js_ = (viewsvue_type_script_lang_js_); 
// EXTERNAL MODULE: /Users/sunhao/Documents/imsunhao/utils/node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(3);

// CONCATENATED MODULE: ./src/views/index.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  src_viewsvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/views/index.vue"
/* harmony default export */ var views = __webpack_exports__["default"] = (component.exports);

/***/ })

}]);