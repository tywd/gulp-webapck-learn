const { src, dest } = require('gulp')
const webpack = require('webpack-stream')
const webpackConfig = require("./webpack.config.js")
const named = require('vinyl-named')
const path = require('path')
const plumber = require('gulp-plumber')
const changed = require('gulp-changed')
const uglify = require('gulp-uglify')

function js() {
  return src(['src/js/**/*.js'])
    .pipe(changed('dist/js/**/'))
    // .pipe(babel({
    //   presets: ['@babel/env'],
    //   plugins: ['@babel/transform-runtime']
    // }))
    .pipe(named(function (file) {
      return file.relative.slice(0, -path.extname(file.path).length)
    }))
    .pipe(webpack(webpackConfig))
    .pipe(plumber())
    .pipe(uglify())
    .pipe(dest('dist/js'))
}

function libJs() {
  return src(['src/lib/**/*.js'])
    .pipe(changed('dist/lib/**/'))
    .pipe(plumber())
    .pipe(dest('dist/lib'))
}

module.exports = {
  js, libJs
}