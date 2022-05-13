// 公有任务
/* function publicTask(cb) {
    console.log('公有任务')
    cb()
}
// 私有任务
function privateTask(cb) {
    console.log('私有任务')
    cb()
}
exports.default = privateTask
exports.publicTask = publicTask */
// series 串行任务
// parallel 并行任务
// 串行任务与并行任务的任意组合 exports.default = series(privateTask, publicTask, parallel(privateTask, series(publicTask)))
const {
  series,
  parallel,
  src,
  dest,
  watch // 监听 src 目录的 html 文件，如果 html 文件有更改，则重新执行 html 任务
} = require('gulp')
const fileinclude = require('gulp-file-include') // 将指定的 html 文件的代码复制到一个 html 文件上
const htmlmin = require('gulp-htmlmin') // html压缩
const changed = require('gulp-changed') // changed 是一个只让更改过的文件通过管道的插件，它可以防止没有更改过的文件重复编译，以此提高效率。
const webserver = require('gulp-webserver') // 一个本地服务器，具有热替换、代理等功能，使用它可以更快捷开发程序 
const del = require('del') // del 插件和 gulp 的 watch 来实现自动删除文件功能。
const Path = require('path')
const uglify = require('gulp-uglify') // 一个用于压缩 js 的插件，下面我们安装这个插件来压缩 js
const plumber = require('gulp-plumber') // 一个可以防止编译出错导致进程退出的插件，如果程序出错，它会将异常抛到终端上，并且防止进程退出。
const cleanCss = require('gulp-clean-css') // 压缩 css 的插件
const sass = require('gulp-sass')(require('sass')) // 使用 sass 编译器
// const sass = require('gulp-sass')(require('node-sass')) // 使用 node-sass 编译器
const imagemin = require('gulp-imagemin') // 压缩图片的插件 cnpm安装，npm安装有报错
// gulp-cache 是所有文件都会通过（可能是指所有文件会通过管道，但是部分文件是从缓存中直接取得，不需要额外处理，因此起到优化作用）
const cache = require('gulp-cache') // 利用 gulp-cache 缓存来优化构建图片过程。
const webpack = require('webpack-stream')
const webpackConfig = require("./webpack.config.js")
const named = require('vinyl-named') // vinyl-named 插件可以解决多页面开发的问题。不至于每次加页面都要去webpack 修改 entry 和 output
const { js, libJs } = require('./gulpfile-js')
const config = require('./config.js')
const preprocess = require("gulp-preprocess") // 预处理 html 的插件，它可以在程序运行或打包前注入 html 的代码。
const sassVariables = require('gulp-sass-variables')
// function html() {
//   return src('src/**/*.html')  // src('src/**/*.html') 中的字符串被 gulp 称为 glob 字符串，glob 字符串是用来匹配文件路径
//     .pipe(dest('dist'))  // pipe 即是管道，管道是用于连接“转换流”或者“可写流”， 这里 pipe 就是用来连接 dest 的转换流（将流转换为文件）。
// }

function html() {
  // **/*.js 能匹配 foo.js,a/foo.js,a/b/foo.js,a/b/c/foo.js
  return src(['src/**/*.html', '!src/include/**.html']) // 处理 src 目录里的所有 html 文件，但是不处理 src/include 里的 html 文件  include 文件夹里的文件就是 “组件”，用来被引入到 html 去。
    .pipe(changed('dist'))
    .pipe(plumber())
    .pipe(fileinclude({
      prefix: '@@', // 引用符号
      basepath: './src/include' // 引用文件路径
    }))
    .pipe(preprocess({
      context: { ...config }
    }))
    .pipe(htmlmin({
      removeComments: true, // 清除HTML注释
      collapseWhitespace: true, // 压缩HTML
      collapseBooleanAttributes: true, // 省略布尔属性的值 <input checked="true"/> ==> <input />
      removeEmptyAttributes: true, // 删除所有空格作属性值 <input id="" /> ==> <input />
      removeScriptTypeAttributes: true, // 删除<script>的type="text/javascript"
      removeStyleLinkTypeAttributes: true, // 删除<style>和<link>的type="text/css"
      minifyJS: true, // 压缩页面JS
      minifyCSS: true // 压缩页面CSS
    }))
    .pipe(dest('dist'))
}


function devServer() {
  return src('dist').pipe(webserver({
    port: 3000,
    livereload: true, // 是否实时加载
    // directoryListing: true, // 是否开启浏览目录
    // open: true, // 是否自动打开
    // proxies: [ // 代理，可以用来解决跨域问题
    //   {source: '/api', target: 'http://xxxx.com', options: {headers: {"Content-Type": 'application/x-www-form-urlencoded'}}}
    // ]
  }))
}

// function js() {
//   return src(['src/js/**/*.js'])
//     .pipe(changed('dist/js/**/'))
//     .pipe(named(function (file) {
//       return file.relative.slice(0, -Path.extname(file.path).length)
//     }))
//     .pipe(webpack(webpackConfig))
//     .pipe(plumber())
//     .pipe(uglify())
//     .pipe(dest('dist/js'))
// }

// function libJs() {
//   return src(['src/lib/**/*.js'])
//     .pipe(changed('dist/lib/**/'))
//     .pipe(plumber())
//     .pipe(dest('dist/lib'))
// }

function css() {
  return src(['src/css/**/*.css'])
    .pipe(changed('dist/css/**/'))
    .pipe(plumber())
    .pipe(cleanCss())
    .pipe(dest('dist/css'))
}

function scss() {
  return src(['src/scss/**/*.scss'])
    .pipe(changed('dist/scss/**/'))
    .pipe(plumber())
    .pipe(sassVariables({
      $CDN: config.CDN,
    }))
    .pipe(sass())
    .pipe(cleanCss())
    .pipe(dest('dist/scss'))
}

function libCss() {
  return src(['src/libCss/**/*.css'])
    .pipe(changed('dist/libCss/**/'))
    .pipe(plumber())
    .pipe(dest('dist/libCss'))
}

function img() {
  return src(['src/assets/img/**/*.{png,jpg,gif,jpeg,ico}']) //后缀都用小写，不然不识别
    .pipe(imagemin({
      optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
      progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
      interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
      multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化
    }))
    .pipe(dest('dist/assets/img'))
}

function watcher() {
  // watch('src/**/*.html', series(html))
  watch('src/**/*.html', series(html)).on('unlink', function (path) { // 将src下被手动删除的html 也一并在dist下删除
    del('dist/**/' + Path.basename(path))
  })
  watch('src/js/**/*.js', series(js)).on('unlink', function (path) {
    del('dist/js/**/' + Path.basename(path))
  })
  watch('src/lib/**/*.js', series(libJs)).on('unlink', function (path) {
    del('dist/lib/**/' + Path.basename(path))
  })
  watch('src/css/**/*.css', series(css)).on('unlink', function (path) {
    del('dist/css/**/' + Path.basename(path))
  })
  watch('src/scss/**/*.scss', series(scss)).on('unlink', function (path) {
    var cssName = Path.basename(path).split('.scss')[0] // scss 编译出来的文件后缀是 css 而不是 scss，需要特别处理
    del('dist/scss/**/' + cssName + '.css')
  })
  watch('src/libCss/**/*.css', series(libCss)).on('unlink', function (path) {
    del('dist/libCss/**/' + Path.basename(path))
  })
  watch('src/assets/img/**/*.{png,jpg,gif,jpeg,ico}', series(img)).on('unlink', function (path) {
    del('dist/assets/img/**/' + Path.basename(path))
  })
}

function clean() {
  return del('dist')
}
console.log('环境变量：' + process.env.NODE_ENV)

// 运行 gulp 命令，就是开发环境
exports.default = series(clean, html, libJs, js, css, scss, libCss, img, devServer, watcher)
// 运行 build 命令，就是生产环境
exports.build = series(clean, html, libJs, js, css, scss, libCss, img)