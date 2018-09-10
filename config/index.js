'use strict'
const path = require('path')

const px2viewport = require('postcss-px-to-viewport')
const postcssAssets = require('postcss-assets')
const cssnano = require('cssnano')

const subPackages = require('./subPackage')

const resolve = dir => {
  return path
    .relative(__dirname, path.join(__dirname, '..', dir))
    .split(path.sep)
    .join('/')
}

module.exports = {
  paths: {
    fileWxml: resolve('src/**/*.wxml'),
    fileJson: resolve(`src/**/*.json`),
    fileWxss: resolve('src/**/*.wxss'),
    fileWxs: resolve('src/**/*.wxs'),
    fileLib: resolve('src/lib/*.js'),
    fileSass: [resolve('src/**/*.scss'), `!${resolve('src/assets/**')}`],
    fileJs: [resolve('src/**/*.js'), `!${resolve('src/lib/**')}`],
    fileStatic: [resolve('static/**'), `!${resolve('static/images/**')}`],
    fileImage: [
      resolve('static/**/*.{png,jpg,jpeg,gif,svg}'),
      resolve('static/*.{png,jpg,jpeg,gif,svg}')
    ], //图片
    fileIcon: resolve('src/assets/icon/*.{png,jpg,jpeg,gif,svg}'), //转base64图标
    fileIconTem: resolve('src/assets/iconTem'),
    autoCreate: [
      resolve('src/components/**'),
      resolve('src/pages/**'),
      ...subPackages
    ] //创建文件夹的同时自动创建文件page 或 components， subPackages是分包的根目录
  },
  dist: {
    baseDist: resolve('dist'),
    static: resolve('dist/static'),
    lib: resolve('dist/lib')
  },
  config: {
    htmlmin: process.env.NODE_ENV === 'production', //是否压缩wxml文件, 出现莫名错误要关闭
    htmlminConfig: {
      removeComments: true,
      collapseWhitespace: true,
      removeEmptyAttributes: true,
      minifyJS: true
    },
    sourcemaps: process.env.NODE_ENV !== 'production', // production为false,减少文件大小
    //babel 配置
    babelConf: {
      presets: [
        [
          '@babel/env',
          {
            modules: process.env.NODE_ENV === 'production' ? false : 'commonjs' //默认生产环境不使用
          }
        ]
      ],
      plugins: []
    }
  },
  //gulp-postcss 插件配置
  postcssPlugins: [
    postcssAssets({
      loadPaths: [resolve('src/assets/iconTem/')], // 将压缩后的图片放到缓存文件夹，防止重复压缩，从缓存文件夹转base64
      relative: true //使用相对路径
    }),
    px2viewport({
      // 详情请看：https://github.com/evrone/postcss-px-to-viewport
      viewportWidth: 750, // 设计图纸的宽度
      viewportHeight: 1334,
      unitPrecision: 5,
      viewportUnit: 'vw',
      fontViewportUnit: 'vmin',
      selectorBlackList: ['px'], //选择器黑名单，不会转化 .px-name
      minPixelValue: 1,
      mediaQuery: false
    }),
    cssnano({
      preset: 'default'
    })
  ],
  resolve: {
    //设置src目录下文件夹或文件的别名
    alias: {
      utils: 'src/utils',
      lodash: 'src/lib/lodash'
    },
    stripExtensions: ['.js', '.jsx', '.es', '.es6', '.mjs']
  }
}
