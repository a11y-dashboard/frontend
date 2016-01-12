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
    extensions: ['', '.js', '.jsx'],
    alias: {
      'finchjs': path.join('finchjs', 'finch.js'),
      'moment': path.join('moment', 'moment'),
      'highlight.js$': path.join('highlight.js', 'lib', 'highlight.js'),
    },
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['react', 'es2015'],
        },
      },
      {
        test: /\.json$/,
        loader: 'json',
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
