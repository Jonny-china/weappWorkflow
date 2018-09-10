'use strict'

const gulp = require('gulp')
const del = require('del')

const buildComplie = require('./base')

gulp.task(
  'build',
  gulp.series(
    gulp.parallel(
      buildComplie.handleLib,
      buildComplie.handleWxml,
      buildComplie.handleWxs,
      buildComplie.handleJson,
      gulp.series(
        buildComplie.handleIcon,
        gulp.parallel(buildComplie.handleSass, buildComplie.handleWxss)
      ),
      buildComplie.handleJs,
      gulp.series(buildComplie.handleStatic, buildComplie.handleImage)
    )
  )
)

gulp.task('clear', () =>
  del('../dist', {
    force: true
  })
)
