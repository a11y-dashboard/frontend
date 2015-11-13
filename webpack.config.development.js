const objectAssign = require('object-assign');
const webpack = require('webpack');
const baseConfig = require('./webpack.config.js');

const config = objectAssign({}, baseConfig, {
  devtool: 'eval-source-map'
});

config.entry.unshift('webpack-hot-middleware/client?reload=true');
config.plugins.push(new webpack.HotModuleReplacementPlugin());

module.exports = config;
