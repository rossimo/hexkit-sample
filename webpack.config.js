const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
    context: path.join(__dirname, 'src'),
    entry: './index.tsx',
    output: {
        filename: 'bundle.js',
        path: __dirname + '/dist'
    },
    target: 'electron-renderer',
    devtool: 'source-map',
    mode: 'development',
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json']
    },
    module: {
        rules: [
            { test: /\.tsx?$/, loader: 'ts-loader' },
            { test: /\.css$/, loader: ['style-loader', 'css-loader'] }
        ]
    },
    plugins: [
        new CopyWebpackPlugin([{
            from: './index.html'
        }, {
            from: './manifest.json'
        }])
    ]
};