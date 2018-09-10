'use strict'

const { join, sep, relative } = require('path')
const gulp = require('gulp')
const del = require('del')

const conf = require('../config')
const options = require('./fileOptios')

const devComplie = require('./base')

const resolve = dir => {
  return relative(__dirname, join(__dirname, '..', dir))
    .split(sep)
    .join('/')
}

// 删除文件或文件夹
const deleteFile = file => {
  del(
    file
      .split(sep)
      .join('/')
      .replace('scss', 'wxss')
      .replace('src', 'dist'),
    {
      force: true
    }
  )
}

// 监听
function watch() {
  gulp
    .watch(conf.paths.fileWxml, gulp.parallel(devComplie.handleWxml))
    .on('unlink', deleteFile)
  gulp
    .watch(conf.paths.fileJson, gulp.parallel(devComplie.handleJson))
    .on('unlink', deleteFile)
  gulp
    .watch(conf.paths.fileWxs, gulp.parallel(devComplie.handleWxs))
    .on('unlink', deleteFile)
  gulp
    .watch(conf.paths.copyLib, gulp.parallel(devComplie.handleLib))
    .on('unlink', deleteFile)
  gulp
    .watch(conf.paths.fileWxss, gulp.parallel(devComplie.handleWxss))
    .on('unlink', deleteFile)
  gulp
    .watch(conf.paths.fileSass, gulp.parallel(devComplie.handleSass))
    .on('unlink', deleteFile)
  gulp
    .watch(conf.paths.fileJs, gulp.parallel(devComplie.handleJs))
    .on('unlink', deleteFile)
  gulp
    .watch(conf.paths.fileStatic, gulp.parallel(devComplie.handleStatic))
    .on('unlink', deleteFile)
  gulp
    .watch(conf.paths.fileImage, gulp.parallel(devComplie.handleImage))
    .on('unlink', deleteFile)

  gulp.watch(conf.paths.fileIcon, gulp.parallel(devComplie.handleIcon))

  // 监听创建删除页面和组件文件夹，页面删除会删除app.json里对应的数据
  const watchFile = gulp.watch(conf.paths.autoCreate)
  watchFile.on('addDir', path => {
    console.log('addDir', path)
    options.create(path)
  })
  watchFile.on('unlinkDir', path => {
    console.log('unlinkDir', path)
    options.remove(path)
  })

  // 监听文件夹的删除
  gulp.watch(resolve('src/**')).on('unlinkDir', path => {
    const relativePath = relative(resolve('src'), path)
    deleteFile(resolve(`dist/${relativePath}`))
  })
}

gulp.task(
  'dev',
  gulp.series(
    gulp.parallel(
      devComplie.handleLib,
      devComplie.handleWxml,
      devComplie.handleWxs,
      devComplie.handleJson,
      gulp.series(
        devComplie.handleIcon,
        gulp.parallel(devComplie.handleSass, devComplie.handleWxss)
      ),
      devComplie.handleJs,
      gulp.series(devComplie.handleStatic, devComplie.handleImage)
    ),
    watch
  )
)

gulp.task('cleanIconTem', () =>
  del(conf.paths.fileIconTem, {
    force: true
  })
)
