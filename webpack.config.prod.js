const path = require('path');
const webpack = require('webpack');

//const isUnfinished = 

console.log('this is the unifished env constiable', process.env.UNFINISHED);

module.exports = {
  entry: [
    './finished/index'
  ],
  output: {
    path: path.join(__dirname, 'static'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),

    new webpack.optimize.UglifyJsPlugin({
        compressor: {
            warnings: true
        }
    })
  ],
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [{
      test: /\.js|\.jsx$/,
      loaders: ['babel'],
      include: path.join(__dirname, 'finished')
    },
    {
      test: /\.js|\.jsx?/,
      loaders: ['babel'],
      include: path.join(__dirname, 'node_modules/react-examples-gallery')
    },
      {
        test: /\.less$/,
        loader: "style!css!less"
      }]
  }
};
