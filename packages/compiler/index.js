'use strict'

// Ignore all deprecations and hope that nothing will silently break in the future.
process.noDeprecation = true

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/compiler-production.js')
} else {
  module.exports = require('./dist/compiler-development.js')
}
