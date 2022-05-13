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
// function html() {
//   return src('src/**/*.html')  // src('src/**/*.html') 中的字符串被 gulp 称为 glob 字符串，glob 字符串是用来匹配文件路径
//     .pipe(dest('dist'))  // pipe 即是管道，管道是用于连接“转换流”或者“可写流”， 这里 pipe 就是用来连接 dest 的转换流（将流转换为文件）。
// }

function html() {
  return src(['src/**/*.html', '!src/include/**.html']) // 处理 src 目录里的所有 html 文件，但是不处理 src/include 里的 html 文件  include 文件夹里的文件就是 “组件”，用来被引入到 html 去。
    .pipe(changed('dist'))
    .pipe(fileinclude({
      prefix: '@@', // 引用符号
      basepath: './src/include' // 引用文件路径
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

function watcher() {
  // watch('src/**/*.html', series(html))
  watch('src/**/*.html', series(html)).on('unlink', function (path) { // 将src下被手动删除的html 也一并在dist下删除
    del('dist/**/' + Path.basename(path))
  })
}

function clean() {
  return del('dist')
}

exports.default = series(clean, html, devServer, watcher)
exports.build = series(html)