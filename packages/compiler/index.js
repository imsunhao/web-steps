'use strict'

// Ignore all deprecations and hope that nothing will silently break in the future.
process.noDeprecation = true

require('./dist/compiler.js').start()
