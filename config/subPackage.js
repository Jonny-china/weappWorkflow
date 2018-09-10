'use strict'
const fs = require('fs')
const path = require('path')

const resolve = dir => {
  return path
    .relative(__dirname, path.join(__dirname, '..', dir))
    .split(path.sep)
    .join('/')
}

const { subPackages } = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'src/app.json'))
)

const root = subPackages && subPackages.map(v => resolve(`src/${v.root}/**`))

module.exports = root
