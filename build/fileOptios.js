'use strict'
const fs = require('fs')
const _ = require('lodash')
const path = require('path')

const resolve = dir => {
  return path
    .relative(__dirname, path.join(__dirname, '..', dir))
    .split(path.sep)
    .join('/')
}
// 转换路径格式
const pathTransform = n => n.split(path.sep).join('/')

// 创建文件夹
const create = dir => {
  console.log(dir)
  const path = pathTransform(dir)
  const file = path.split('../src/').join('')
  const pram = file.split('/')[0]

  let json = `{\n\t"navigationBarTitleText": "",\n\t"usingComponents": {}\n}`
  let wxml = `<!-- /${file}/index.wxml -->`
  let js = `/* app */\n\nPage({\n\tdata: {},\n\n\tonLoad(options) {}\n})`
  let scss = `/* /${file}/index.scss */`

  if (pram === 'components') {
    json = `{\n\t"component": true,\n\t"usingComponents": {}\n}`
    js = `/* app */\n\nComponent({\n\tproperties: {},\n\n\tdata: {},\n\n\tmethods: {}\n})`
  }

  fs.writeFile(`${path}/index.js`, js, err => {
    if (err) throw err
    else console.log(`创建${file}/index.js成功`)
  })
  fs.writeFile(`${path}/index.json`, json, err => {
    if (err) throw err
    else console.log(`创建${file}/index.json成功`)
  })
  fs.writeFile(`${path}/index.scss`, scss, err => {
    if (err) throw err
    else console.log(`创建${file}/index.scss成功`)
  })
  fs.writeFile(`${path}/index.wxml`, wxml, err => {
    if (err) throw err
    else console.log(`创建${file}/index.wxml成功`)
  })

  if (pram !== 'components') {
    const appJson = JSON.parse(fs.readFileSync(resolve('src/app.json')))

    if (pram !== 'pages') {
      const packages = appJson.subPackages || []
      packages.forEach(item => {
        if (item.root === pram) {
          const pages = item.pages || []
          item.pages = [...pages, `${file.replace(`${pram}/`, '')}/index`]
        }
      })
      appJson.subPackages = packages
    } else appJson[pram].push(`${file}/index`)
    fs.writeFile(resolve('src/app.json'), JSON.stringify(appJson), err => {
      if (err) throw err
      else console.log(`app.json已修改`)
    })
  }
}

// 删除文件夹
const remove = dir => {
  const path = pathTransform(dir)
  const file = path.split('/src/')[1]
  const pram = file.split('/')[0]

  const appJson = JSON.parse(fs.readFileSync(resolve('src/app.json')))

  if (pram !== 'pages' && pram !== 'components') {
    const packages = appJson.subPackages || []
    packages.forEach(item => {
      if (item.root === pram)
        item.pages = _.filter(
          item.pages,
          v => v !== `${file.replace(`${pram}/`, '')}/index`
        )
    })
    appJson.subPackages = packages
  } else if (pram === 'pages')
    appJson[pram] = _.filter(appJson[pram], v => v !== `${file}/index`)
  if (pram !== 'components')
    fs.writeFile(resolve('src/app.json'), JSON.stringify(appJson), err => {
      if (err) throw err
      else console.log(`app.json已修改`)
    })
}

module.exports = {
  create,
  remove
}
