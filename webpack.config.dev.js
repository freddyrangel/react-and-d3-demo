const path = require('path');
const webpack = require('webpack');
const cwd = process.cwd();
const TARGET_DIRECTORY = process.env.TARGET_DIRECTORY;

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: [
    'eventsource-polyfill', // necessary for hot reloading with IE
    'webpack-hot-middleware/client',
    `./${TARGET_DIRECTORY}/index`
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  resolve: {
  },
  resolve: {
      modulesDirectories: [cwd + `/${TARGET_DIRECTORY}`, 'node_modules'],
      extensions: ['', '.json', '.jsx', '.js'],
  },
  module: {
    loaders: [{
      test: /\.js|\.jsx?/,
      loaders: ['babel'],
      include: path.join(__dirname, TARGET_DIRECTORY)
    },
    {
        test: /\.less$/,
        loader: "style!css!less"
    }]
  }
};
