'use strict'

module.exports = require('./dist/index.js')

const path = require('path')

module.exports.defaultTemplatePath = path.resolve(__dirname, './default.template.html')
