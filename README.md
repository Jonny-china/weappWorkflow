# weappWorkflow

> 自用的微信小程序工作流

## 基本用法

```bash
$ git clone https://github.com/Jonny-china/weappWorkflow.git
$ cd weappWorkflow
$ yarn
$ yarn dev  //开发环境，监听文件变化
$ yarn build //生产环境
```

> 在微信开发者工具中打开文件夹 weappWorkflow，启动项目

## 目录结构

```
|——build             gulp的环境代码
|——config            gulp的配置文件
|——node_modules      项目运行依赖的npm包
|——src               项目代码文件夹
  |——assets          资源文件夹不会copy到dist
    |——icon          icon图标会转化为base64
    |——scss          scss引用，内置了颜色基本变量
  |——components      自定义的组件文件夹，在里面创建文件夹会自动创建四个文件(.wxml,.json,.js,.wxss)
  |——lib             引用的一些库文件（小白不会自动引用npm包），内置了小程序可用的lodash(v4.17.10)
    |——runtime.js    async/await 语法必须的文件
  |——packegeA        小程序分包文件夹，须在app.json配置分包必须的参    数，创建文件夹自动创建文件
  |——pages           小程序主包文件夹，创建文件夹自动创建文件
  |——utils           工具类
|——static            静态资源文件，会复制到dist，该文件夹下的图片格式会被压缩
|——package.json      npm包配置文件
|——README.md         readme文档
```

## 功能特点说明

> 1.支持 async/await 语法

src/lib 下的 runtime.js 必须有

> 2.支持设置 src 下的文件和文件夹别名

类似与 webpack 的 alias，在 _config/index.js_ 的 `resolve.alias` 里设置

> 3.自动压缩图片，wxml，js，json，wxss，减小小程序包体积

js 默认转 es5，生产环境 js 不开启 sourcemaps

> 4.支持 scss，会自动编译为 wxss

> 5.样式单位使用 vw 代替 px，（行内样式不支持）

使用 postcss 的[postcss-px-to-viewport](https://github.com/evrone/postcss-px-to-viewport) 插件，具体配置在 _config/index.js_ 的 `postcssPlugins.px2viewport` 里设置

> 6.icon 图标转 base64

将 icon 小图标转换为 base64 用背景图方式引用，主要使用 postcss 的 [postcss-assets](https://github.com/borodean/postcss-assets) 插件，，具体配置在 _config/index.js_ 的 `postcssPlugins.postcssAssets` 里设置，`postcssAssets`需要在`px2viewport`上面，不然 _postcss-assets_ 的 _Image dimensions_ 不会转换单位。具体功能可以去[查看文档](https://github.com/borodean/postcss-assets)

    body {
    width: width('images/foobar.png'); /_ 320px _/
    height: height('images/foobar.png'); /_ 240px _/
    background-size: size('images/foobar.png'); /_ 320px 240px _/
    background: inline('images/foobar.png'); /_ 转为 base64 _/
    }

> 7.在 dev 模式下自动创建 page 文件和 components 文件

需要在 pages 和 components 文件夹下创建文件夹会自动创建 wxml、js、json、scss 文件，分包自动创建，需在 _app.js_ 里配置 `subPackages`的 `root`，**pages 不需要写否则会重复**， 可以看[小程序文档-分包加载](https://developers.weixin.qq.com/miniprogram/dev/framework/subpackages.html)

---

**自用的小程序开发，不适合大部分人**

---
