const path = require('path');

module.exports = {
    mode: "development",
    entry: './src/index.js',
    devtool: '#eval-source-map',
    output: {
        path: path.resolve(__dirname, 'build/bundle'),
        filename: 'app.js'
    },
    devServer: {
        hot: true,
        publicPath: '/bundle/',
        contentBase: path.join(__dirname, 'public'),
        watchContentBase: true,
        stats: {
            children: false,
            maxModules: 0
        }
    }
};