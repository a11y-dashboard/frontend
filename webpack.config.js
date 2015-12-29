const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = {
  entry: [
    path.join(__dirname, 'src/main.js'),
  ],
  output: {
    path: path.join(__dirname, 'dist/'),
    filename: '[name].js',
    publicPath: '/',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      inject: 'body',
      filename: 'index.html',
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en-au/),
  ],
  resolve: {
    alias: {
      'finchjs': path.join('finchjs', 'finch.js'),
      'moment': path.join('moment', 'moment'),
    },
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
      },
      {
        test: /\.json$/,
        loader: 'json',
      },
      {
        test: /\.handlebars$/,
        loader: 'handlebars-loader',
      },
      {
        test: /\.less$/,
        loader: 'style!css!less',
      },
      {
        test: /\.css$/,
        loader: 'style!css',
      },
      {
        test: /finchjs/,
        loader: 'exports?this.Finch',
      },
    ],
  },
};

module.exports = config;
