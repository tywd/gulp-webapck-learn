### package.json 部分说明
```js
"devDependencies": {
    "gulp": "^4.0.2",
    "gulp-htmlmin": "^5.0.1", //  gulp 的一个压缩 html 的插件
    "gulp-file-include": "^2.3.0", // 将指定的 html 文件的代码复制到一个 html 文件上
    "gulp-changed": "^4.0.3", // changed 是一个只让更改过的文件通过管道的插件，它可以防止没有更改过的文件重复编译，以此提高效率。
    "gulp-webserver": "^0.9.1", // 一个本地服务器，具有热替换、代理等功能，使用它可以更快捷开发程序 
    "del": "^6.0.0", // del 插件和 gulp 的 watch 来实现自动删除文件功能。
    "gulp-plumber": "^1.2.1", // 一个可以防止编译出错导致进程退出的插件，如果程序出错，它会将异常抛到终端上，并且防止进程退出。
    "gulp-uglify": "^3.0.2", // 一个用于压缩 js 的插件，下面我们安装这个插件来压缩 js
}
```