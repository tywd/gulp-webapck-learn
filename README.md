### package.json 部分说明
```js
"devDependencies": {
    "gulp": "^4.0.2",
    "gulp-htmlmin": "^5.0.1", //  gulp 的一个压缩 html 的插件
    "gulp-file-include": "^2.3.0", // 将指定的 html 文件的代码复制到一个 html 文件上
    "gulp-changed": "^4.0.3", // changed 是一个只让更改过的文件通过管道的插件，它可以防止没有更改过的文件重复编译，以此提高效率。
    "gulp-webserver": "^0.9.1", // 一个本地服务器，具有热替换、代理等功能，使用它可以更快捷开发程序 
    "del": "^6.0.0", // del 插件和 gulp 的 watch 来实现自动删除文件功能。
}
```