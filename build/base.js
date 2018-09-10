'use strict'

const { join } = require('path')
const gulp = require('gulp')
const _ = require('lodash')
const gutil = require('gulp-util')
const gulpif = require('gulp-if')
const htmlmin = require('gulp-htmlmin')
const replace = require('gulp-replace')
const babel = require('gulp-babel')
const sass = require('gulp-sass')
const rename = require('gulp-rename')
const postcss = require('gulp-postcss')
const sourcemaps = require('gulp-sourcemaps')
const newer = require('gulp-newer')

const uglifyJs = require('uglify-js')
const composer = require('gulp-uglify/composer')
const minify = composer(uglifyJs, console)

const jsonminify = require('gulp-jsonminify')

const imagemin = require('gulp-imagemin')

const wxAsync = require('./wxAsync')

const conf = require('../config')

const resolve = dir => {
  return join(__dirname, '..', dir)
}

const imageminOptions = [
  imagemin.gifsicle({ interlaced: true }),
  imagemin.jpegtran({ progressive: true }),
  imagemin.optipng({ optimizationLevel: 5 }),
  imagemin.svgo({
    plugins: [{ removeViewBox: true }, { cleanupIDs: false }]
  })
]

// handleJs 配置插件
const alias = files =>
  files && _.size(files) > 0
    ? _.mapValues(files, v => v.replace('src', '..'))
    : {}
const moduleResolve = [
  'module-resolver',
  {
    alias: alias(conf.resolve.alias),
    stripExtensions: conf.resolve.stripExtensions,
    cwd: resolve('src/**')
  }
]
const plugins = conf.config.babelConf.plugins || []
conf.config.babelConf.plugins = [...plugins, moduleResolve]

const Complie = {
  handleWxml() {
    return gulp
      .src(conf.paths.fileWxml, { since: gulp.lastRun(Complie.handleWxml) })
      .pipe(gulpif(conf.config.htmlmin, replace(/\<wxs/, '<script ')))
      .pipe(gulpif(conf.config.htmlmin, replace(/\<\/wxs\>/, '</script>')))
      .pipe(gulpif(conf.config.htmlmin, htmlmin(conf.config.htmlminConfig)))
      .pipe(gulpif(conf.config.htmlmin, replace(/\<script/, '<wxs ')))
      .pipe(gulpif(conf.config.htmlmin, replace(/\<\/script\>/, '</wxs>')))
      .pipe(gulp.dest(conf.dist.baseDist))
  },
  handleJson() {
    return gulp
      .src(conf.paths.fileJson, { since: gulp.lastRun(Complie.handleJson) })
      .pipe(jsonminify())
      .pipe(gulp.dest(conf.dist.baseDist))
  },
  handleWxs() {
    return gulp
      .src(conf.paths.fileWxs, { since: gulp.lastRun(Complie.handleWxs) })
      .pipe(babel({ presets: ['@babel/env'] }))
      .pipe(minify())
      .pipe(gulp.dest(conf.dist.baseDist))
  },
  handleLib() {
    return gulp
      .src(conf.paths.fileLib, { since: gulp.lastRun(Complie.handleLib) })
      .pipe(minify())
      .pipe(gulp.dest(conf.dist.lib))
  },
  handleWxss() {
    return gulp
      .src(conf.paths.fileWxss, { since: gulp.lastRun(Complie.handleWxss) })
      .pipe(postcss(conf.postcssPlugins))
      .pipe(gulp.dest(conf.dist.baseDist))
  },
  handleSass() {
    return gulp
      .src(conf.paths.fileSass, { since: gulp.lastRun(Complie.handleSass) })
      .pipe(sass().on('error', sass.logError))
      .pipe(postcss(conf.postcssPlugins))
      .pipe(rename({ extname: '.wxss' }))
      .pipe(gulp.dest(conf.dist.baseDist))
  },
  handleJs() {
    return gulp
      .src(conf.paths.fileJs, { since: gulp.lastRun(Complie.handleJs) })
      .pipe(gulpif(conf.config.sourcemaps, sourcemaps.init()))
      .pipe(
        babel(conf.config.babelConf).on('error', function(err) {
          gutil.log(err)
          this.emit('end')
        })
      )
      .pipe(
        wxAsync({
          wxPath: resolve('src/lib/runtime.js')
        })
      )
      .pipe(minify())
      .pipe(gulpif(conf.config.sourcemaps, sourcemaps.write('.')))
      .pipe(gulp.dest(conf.dist.baseDist))
  },
  handleStatic() {
    return gulp
      .src(conf.paths.fileStatic, { since: gulp.lastRun(Complie.handleStatic) })
      .pipe(gulp.dest(conf.dist.static))
  },
  handleImage() {
    return gulp
      .src(conf.paths.fileImage, { since: gulp.lastRun(Complie.handleImage) })
      .pipe(newer(conf.dist.static))
      .pipe(imagemin(imageminOptions))
      .pipe(gulp.dest(conf.dist.static))
  },
  handleIcon() {
    return gulp
      .src(conf.paths.fileIcon, { since: gulp.lastRun(Complie.handleIcon) })
      .pipe(newer(conf.paths.fileIconTem))
      .pipe(imagemin(imageminOptions))
      .pipe(gulp.dest(conf.paths.fileIconTem))
  }
}

module.exports = Complie
