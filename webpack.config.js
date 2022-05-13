console.log('利用了 webpack ！！！')

const path = require('path')

module.exports = {
    mode: 'development',
    devtool: 'eval-cheap-module-source-map',
    entry: {
        index: path.resolve(__dirname, './src/js/index.js'),
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, './dist'),
    },
    module: {
        rules: [

        ]
    },
    resolve: {
        alias: {

        }
    },
}