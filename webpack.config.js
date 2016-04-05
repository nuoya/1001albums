const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const TARGET = process.env.npm_lifecycle_event;


common = {
  entry: './main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/dist/',
    filename: 'bundle.js' },
  module: {
    loaders: [
      {
        test: /.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'react']
        }
      },
      {
        test: /\.css$/,
        loader: "style-loader!css-loader"
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "url-loader?limit=10000&mimetype=application/font-woff"
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "file-loader"
      }
    ]
  }
};


if(TARGET == 'start' || !TARGET) {
  module.exports = merge(common, {devtool: 'eval-source-map'});
} else {
  module.exports = merge(common, {})
}
