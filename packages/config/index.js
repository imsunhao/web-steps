'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/config.cjs.prod.js')
} else {
  module.exports = require('./dist/config.cjs.js')
}
