console.log('利用了 webpack ！！！')

const path = require('path')

module.exports = {
    mode: 'development',
    devtool: 'eval-cheap-module-source-map',
    // entry: {
    //     index: path.resolve(__dirname, './src/js/index.js'),
    // },
    // output: {
    //     filename: '[name].js',
    //     path: path.resolve(__dirname, './dist'),
    // },
    module: {
        rules: [{
            test: /\.m?js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env'],
                    plugins: ['@babel/plugin-proposal-object-rest-spread',
                        '@babel/plugin-transform-runtime'
                    ],
                    cacheDirectory: true,
                }
            }
        }]
    },
    resolve: {
        alias: {

        }
    },
}