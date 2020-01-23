'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/build.cjs.prod.js')
} else {
  module.exports = require('./dist/build.cjs.js')
}
