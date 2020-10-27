#!/usr/bin/env node
// This file exists because you can't put ^^shebang^^ on top of TypeScript file
// So we make this plain JavaScript file instead, and call the TypeScript one

const path = require('path')
const fs = require('fs')
const clipath = fs.existsSync(path.join(__dirname, 'build')) ? path.join(__dirname, 'build', 'cli.js') : path.join(__dirname, 'cli.js')
require(clipath)
