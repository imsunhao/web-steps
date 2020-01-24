const execa = require('execa')

execa.sync('node', ['--inspect-brk=32000', `scripts/${process.argv[2]}.js`, ...process.argv.slice(3)], {
  stdio: 'inherit'
})
