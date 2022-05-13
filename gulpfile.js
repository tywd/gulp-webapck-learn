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
const { series, parallel, src, dest } = require('gulp')

function html() {
  return src('src/**/*.html')
    .pipe(dest('dist'))
}

exports.build = series(html)